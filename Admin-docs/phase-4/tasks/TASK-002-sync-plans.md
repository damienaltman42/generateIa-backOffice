# TASK-002: Synchronisation des Plans avec Stripe

**Type**: Backend Development  
**Priorité**: 🟡 Haute  
**Estimation**: 1 jour  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 1  
**Dépend de**: TASK-001  

## Description

Synchroniser les plans locaux (Free, Pro) avec Stripe Products et Prices. Inclut la création des prix pour les crédits supplémentaires et la mise à jour de l'entité Plan.

## Contexte

- Plans Free et Pro existent dans la base de données
- Prix des crédits supplémentaires : 3€ par unité
- Pas de stripe_product_id ou stripe_price_id dans l'entité Plan

## Critères d'acceptation

- [x] Migration ajoutant stripe_product_id et stripe_price_id à Plan
- [x] Script de synchronisation des plans fonctionnel
- [x] Prix Stripe créés pour les crédits supplémentaires
- [x] Endpoint admin pour synchroniser manuellement
- [x] Validation de la cohérence des données
- [x] Mode dry-run disponible

## Tâches techniques

### 1. Migration de l'entité Plan
```typescript
// migration: AddStripeIdsToPlan
export class AddStripeIdsToPlan1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('plans', 
      new TableColumn({
        name: 'stripe_product_id',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
    
    await queryRunner.addColumn('plans',
      new TableColumn({
        name: 'stripe_price_id_monthly',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
    
    await queryRunner.addColumn('plans',
      new TableColumn({
        name: 'stripe_price_id_yearly',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
  }
}
```

### 2. Service de synchronisation
```typescript
// plan-sync.service.ts
@Injectable()
export class PlanSyncService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
  ) {}

  async syncAllPlans(dryRun = false): Promise<SyncResult[]> {
    const plans = await this.planRepo.find();
    const results = [];

    for (const plan of plans) {
      const result = await this.syncPlan(plan, dryRun);
      results.push(result);
    }

    // Créer les prix pour les crédits
    await this.createCreditPrices(dryRun);

    return results;
  }

  private async syncPlan(plan: Plan, dryRun: boolean) {
    // 1. Créer ou mettre à jour le Product
    const product = await this.createOrUpdateProduct(plan);
    
    // 2. Créer les Prices (monthly et yearly)
    const monthlyPrice = await this.createPrice(plan, 'monthly', product.id);
    const yearlyPrice = await this.createPrice(plan, 'yearly', product.id);

    if (!dryRun) {
      plan.stripe_product_id = product.id;
      plan.stripe_price_id_monthly = monthlyPrice.id;
      plan.stripe_price_id_yearly = yearlyPrice.id;
      await this.planRepo.save(plan);
    }

    return { plan, product, prices: [monthlyPrice, yearlyPrice] };
  }
}
```

### 3. Prix pour les crédits supplémentaires
```typescript
// Structure des prix des crédits
const CREDIT_PRICES = [
  {
    name: 'Extra Article Credit',
    unit_amount: 300, // 3€ en centimes
    metadata: { type: 'article_credit' }
  },
  {
    name: 'Extra Social Post Credit',
    unit_amount: 300,
    metadata: { type: 'social_post_credit' }
  },
  {
    name: 'Extra Story Credit',
    unit_amount: 300,
    metadata: { type: 'story_credit' }
  }
];
```

### 4. Controller admin
```typescript
// admin-plans.controller.ts
@Controller('admin/plans')
@UseGuards(JwtAuthGuard) // AdminAuthMiddleware appliqué automatiquement
export class AdminPlansController {
  constructor(private planSyncService: PlanSyncService) {}

  @Post('sync')
  async syncPlans(@Query('dryRun') dryRun?: boolean) {
    const results = await this.planSyncService.syncAllPlans(
      dryRun === 'true'
    );
    
    return {
      success: true,
      dryRun: dryRun === 'true',
      results,
    };
  }

  @Get('sync/status')
  async getSyncStatus() {
    // Vérifier la cohérence entre local et Stripe
    return await this.planSyncService.checkSyncStatus();
  }
}
```

## Dépendances

- **TASK-001** : Infrastructure Stripe requise
- Bloque la création de subscriptions (TASK-003)

## Risques

- **Duplication** : Éviter de créer des doublons dans Stripe
- **Prix incorrects** : Vérifier les montants et devises
- **Désynchronisation** : Prévoir une vérification régulière

## Définition de "Done"

- [x] Migration exécutée avec succès
- [x] Plans synchronisés avec Stripe
- [x] Prix des crédits créés dans Stripe
- [x] Documentation du processus de sync
- [x] Script de vérification de cohérence

## Notes

- Les prix sont en centimes (300 = 3.00€)
- Utiliser les metadata Stripe pour identifier les types
- Prévoir un script de rollback si nécessaire
- Logger toutes les opérations Stripe 