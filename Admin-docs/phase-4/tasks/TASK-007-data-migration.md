# TASK-007: Migration des Données Existantes

**Type**: Backend Development / DevOps  
**Priorité**: 🟡 Haute  
**Estimation**: 1 jour  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 2  
**Dépend de**: TASK-001, TASK-002, TASK-003  

## Description

Créer un script de migration pour synchroniser les utilisateurs et subscriptions existants avec Stripe. Inclut la création des customers, migration des subscriptions actives et conservation de l'historique.

## Contexte

- Utilisateurs existants sans stripe_customer_id
- Subscriptions actives non liées à Stripe
- Besoin de migration progressive sans interruption
- Conservation de l'historique de consommation

## Critères d'acceptation

- [ ] Script de migration avec mode dry-run
- [ ] Création des customers Stripe pour tous les users
- [ ] Migration des subscriptions actives
- [ ] Mapping des plans locaux vers Stripe
- [ ] Rapport détaillé de migration
- [ ] Rollback possible en cas d'erreur

## Tâches techniques

### 1. Script de migration principal
```typescript
// scripts/migrate-to-stripe.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MigrationService } from './services/migration.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationService);

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const batchSize = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '10');
  const onlyActive = args.includes('--only-active');

  console.log('Starting Stripe migration...');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Only active: ${onlyActive}`);

  try {
    const result = await migrationService.migrateToStripe({
      dryRun,
      batchSize,
      onlyActive,
    });

    console.log('\nMigration completed!');
    console.log(JSON.stringify(result, null, 2));

    // Générer le rapport
    await migrationService.generateReport(result);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap();
```

### 2. Service de migration
```typescript
// migration.service.ts
@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private stripeService: StripeService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    private dataSource: DataSource,
  ) {}

  async migrateToStripe(options: MigrationOptions): Promise<MigrationResult> {
    const result: MigrationResult = {
      totalUsers: 0,
      migratedUsers: 0,
      totalSubscriptions: 0,
      migratedSubscriptions: 0,
      errors: [],
      skipped: [],
    };

    // 1. Récupérer les utilisateurs à migrer
    const users = await this.getUsersToMigrate(options.onlyActive);
    result.totalUsers = users.length;

    // 2. Migrer par batch
    for (let i = 0; i < users.length; i += options.batchSize) {
      const batch = users.slice(i, i + options.batchSize);
      
      this.logger.log(`Processing batch ${i / options.batchSize + 1}...`);
      
      for (const user of batch) {
        try {
          await this.migrateUser(user, options.dryRun, result);
        } catch (error) {
          result.errors.push({
            userId: user.id,
            email: user.email,
            error: error.message,
          });
        }
      }

      // Pause entre les batches pour éviter rate limiting
      if (i + options.batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return result;
  }

  private async migrateUser(
    user: User,
    dryRun: boolean,
    result: MigrationResult
  ): Promise<void> {
    // Vérifier si déjà migré
    if (user.subscription?.stripe_customer_id) {
      result.skipped.push({
        userId: user.id,
        reason: 'Already has Stripe customer',
      });
      return;
    }

    // 1. Créer le customer Stripe
    const customer = await this.createStripeCustomer(user, dryRun);
    
    if (!dryRun && customer) {
      // Sauvegarder le customer ID
      await this.userRepo.update(user.id, {
        subscription: {
          stripe_customer_id: customer.id,
        },
      });
    }

    result.migratedUsers++;
    this.logger.log(`Created customer for ${user.email}: ${customer?.id || 'DRY RUN'}`);

    // 2. Migrer la subscription active
    if (user.subscription && user.subscription.status === 'active') {
      await this.migrateSubscription(user.subscription, customer, dryRun, result);
    }
  }

  private async migrateSubscription(
    subscription: Subscription,
    customer: Stripe.Customer | null,
    dryRun: boolean,
    result: MigrationResult
  ): Promise<void> {
    if (!customer || dryRun) {
      result.totalSubscriptions++;
      return;
    }

    // Trouver le prix Stripe correspondant
    const plan = await this.planRepo.findOne({
      where: { id: subscription.plan_id },
    });

    if (!plan?.stripe_price_id_monthly && !plan?.stripe_price_id_yearly) {
      throw new Error(`Plan ${plan?.name} not synced with Stripe`);
    }

    const priceId = subscription.billing_cycle === 'yearly' 
      ? plan.stripe_price_id_yearly 
      : plan.stripe_price_id_monthly;

    // Créer la subscription Stripe
    const stripeSubscription = await this.stripeService.createSubscription({
      customer: customer.id,
      items: [{ price: priceId }],
      metadata: {
        migrated: 'true',
        original_subscription_id: subscription.id,
        migration_date: new Date().toISOString(),
      },
      // Aligner les dates de période
      billing_cycle_anchor: Math.floor(subscription.current_period_end.getTime() / 1000),
      proration_behavior: 'none', // Pas de prorata pour la migration
    });

    // Mettre à jour la subscription locale
    subscription.stripe_subscription_id = stripeSubscription.id;
    subscription.stripe_payment_method_id = stripeSubscription.default_payment_method as string;
    
    await this.subRepo.save(subscription);

    result.totalSubscriptions++;
    result.migratedSubscriptions++;
  }
}
```

### 3. Commande NPM
```json
// package.json
{
  "scripts": {
    // ... autres scripts
    "stripe:migrate": "ts-node -r tsconfig-paths/register scripts/migrate-to-stripe.ts",
    "stripe:migrate:dry": "npm run stripe:migrate -- --dry-run",
    "stripe:migrate:active": "npm run stripe:migrate -- --only-active --batch=20"
  }
}
```

### 4. Rapport de migration
```typescript
// Format du rapport
interface MigrationReport {
  timestamp: Date;
  mode: 'dry-run' | 'live';
  summary: {
    totalUsers: number;
    migratedUsers: number;
    totalSubscriptions: number;
    migratedSubscriptions: number;
    errors: number;
    skipped: number;
  };
  errors: Array<{
    userId: string;
    email: string;
    error: string;
  }>;
  skipped: Array<{
    userId: string;
    reason: string;
  }>;
  successfulMigrations: Array<{
    userId: string;
    email: string;
    stripeCustomerId: string;
    stripeSubscriptionId?: string;
  }>;
}
```

### 5. Script de vérification post-migration
```typescript
// scripts/verify-stripe-migration.ts
async function verifyMigration() {
  const unmigrated = await userRepo.count({
    where: {
      subscription: {
        stripe_customer_id: IsNull(),
      },
    },
  });

  const activeWithoutStripe = await subRepo.count({
    where: {
      status: 'active',
      stripe_subscription_id: IsNull(),
    },
  });

  console.log('Verification Results:');
  console.log(`- Unmigrated users: ${unmigrated}`);
  console.log(`- Active subscriptions without Stripe: ${activeWithoutStripe}`);

  // Vérifier la cohérence
  const inconsistencies = await this.checkConsistencies();
  if (inconsistencies.length > 0) {
    console.error('Found inconsistencies:', inconsistencies);
  }
}
```

## Dépendances

- **TASK-001** : Infrastructure Stripe
- **TASK-002** : Plans synchronisés
- **TASK-003** : SubscriptionService

## Risques

- **Rate limiting Stripe** : Respecter les limites d'API
- **Timeout** : Prévoir des batches pour grandes bases
- **Données incohérentes** : Validation avant migration
- **Rollback complexe** : Sauvegarder l'état avant

## Définition de "Done"

- [ ] Script de migration fonctionnel
- [ ] Mode dry-run validé
- [ ] Documentation du processus
- [ ] Script de vérification
- [ ] Rapport de migration généré
- [ ] Plan de rollback documenté

## Notes

- Toujours faire un dry-run avant la migration réelle
- Sauvegarder la base de données avant
- Prévoir une fenêtre de maintenance si nécessaire
- Logger toutes les opérations pour audit
- Garder les IDs originaux dans les metadata Stripe 