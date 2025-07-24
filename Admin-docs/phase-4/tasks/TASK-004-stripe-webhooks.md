# TASK-004: Webhooks Stripe

**Type**: Backend Development  
**Priorité**: 🔴 Critique  
**Estimation**: 2 jours  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 1  
**Dépend de**: TASK-001  

## Description

Implémenter le système de webhooks Stripe pour la synchronisation en temps réel des événements de paiement et de subscription. Inclut la validation de signature, l'idempotence et la gestion des erreurs.

## Contexte

- Les webhooks sont critiques pour la synchronisation
- ConsumptionService dépend des périodes à jour
- Besoin d'idempotence pour éviter les doublons

## Critères d'acceptation

- [ ] Endpoint webhook sécurisé et validé
- [ ] Gestion de tous les événements critiques
- [ ] Idempotence garantie (table stripe_events)
- [ ] Retry automatique en cas d'échec
- [ ] Logs détaillés pour audit
- [ ] Alertes en cas d'échec répété

## Tâches techniques

### 1. Migration pour la table d'événements
```typescript
// migration: CreateStripeEventsTable
export class CreateStripeEventsTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stripe_events',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: "'pending'",
          },
          {
            name: 'data',
            type: 'json',
          },
          {
            name: 'error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'attempts',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'idx_type_status',
            columnNames: ['type', 'status'],
          },
          {
            name: 'idx_created_at',
            columnNames: ['created_at'],
          },
        ],
      }),
    );
  }
}
```

### 2. Controller Webhook
```typescript
// webhook.controller.ts
@Controller('admin/billing/webhooks')
export class WebhookController {
  constructor(
    private webhookService: WebhookService,
    @Inject(stripeConfig.KEY) private config: ConfigType<typeof stripeConfig>,
  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
      // Valider la signature
      event = this.stripeService.constructEvent(
        request.rawBody,
        signature,
        this.config.webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException('Invalid signature');
    }

    // Vérifier l'idempotence
    const existingEvent = await this.webhookService.findEvent(event.id);
    if (existingEvent && existingEvent.status === 'completed') {
      return { received: true, duplicate: true };
    }

    // Traiter l'événement
    try {
      await this.webhookService.processEvent(event);
      return { received: true };
    } catch (error) {
      // Logger l'erreur mais retourner 200 pour éviter les retry Stripe
      this.logger.error('Webhook processing failed', error);
      return { received: true, error: true };
    }
  }
}
```

### 3. Service de traitement des webhooks
```typescript
// webhook.service.ts
@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(StripeEvent) private eventRepo: Repository<StripeEvent>,
    private subscriptionService: SubscriptionService,
    private auditService: AuditService,
  ) {}

  async processEvent(event: Stripe.Event): Promise<void> {
    // Enregistrer l'événement
    const stripeEvent = await this.saveEvent(event);

    try {
      // Marquer comme en cours
      stripeEvent.status = 'processing';
      await this.eventRepo.save(stripeEvent);

      // Router vers le bon handler
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event);
          break;
        
        case 'customer.subscription.trial_will_end':
          await this.handleTrialEnding(event);
          break;
        
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      // Marquer comme complété
      stripeEvent.status = 'completed';
      stripeEvent.processed_at = new Date();
      await this.eventRepo.save(stripeEvent);

      // Audit
      await this.auditService.log({
        action: `webhook.${event.type}`,
        entity_type: 'stripe_event',
        entity_id: event.id,
        metadata: { livemode: event.livemode },
      });

    } catch (error) {
      // Enregistrer l'échec
      stripeEvent.status = 'failed';
      stripeEvent.error = error.message;
      stripeEvent.attempts += 1;
      await this.eventRepo.save(stripeEvent);

      // Re-throw pour que le job puisse retry
      throw error;
    }
  }

  private async handleSubscriptionUpdated(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Synchroniser avec la base locale
    const localSub = await this.subscriptionService
      .findByStripeId(subscription.id);
    
    if (!localSub) {
      this.logger.error(`Subscription not found: ${subscription.id}`);
      return;
    }

    // Mettre à jour les champs importants
    localSub.status = this.mapStripeStatus(subscription.status);
    localSub.current_period_start = new Date(subscription.current_period_start * 1000);
    localSub.current_period_end = new Date(subscription.current_period_end * 1000);

    // Sauvegarder
    await this.subscriptionService.updateFromWebhook(localSub);

    // Si changement de période, notifier ConsumptionService
    if (this.isPeriodChanged(localSub, subscription)) {
      await this.consumptionService.handlePeriodRenewal(
        localSub.user_id,
        localSub.current_period_start,
        localSub.current_period_end,
      );
    }
  }
}
```

### 4. Job de retry pour les échecs
```typescript
// webhook-retry.processor.ts
@Processor('webhook-retry')
export class WebhookRetryProcessor {
  constructor(
    private webhookService: WebhookService,
    @InjectRepository(StripeEvent) private eventRepo: Repository<StripeEvent>,
  ) {}

  @Process()
  async retryFailedWebhooks() {
    const failedEvents = await this.eventRepo.find({
      where: {
        status: 'failed',
        attempts: LessThan(3),
        created_at: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)),
      },
      order: { created_at: 'ASC' },
      take: 10,
    });

    for (const event of failedEvents) {
      try {
        await this.webhookService.processEvent(event.data);
      } catch (error) {
        this.logger.error(`Retry failed for event ${event.id}`, error);
      }
    }
  }
}
```

### 5. Configuration des webhooks Stripe
```bash
# Configuration dans Stripe Dashboard
Endpoint URL: https://api.yourdomain.com/admin/billing/webhooks

Events to listen:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.trial_will_end
- payment_intent.succeeded
- payment_intent.payment_failed
```

## Dépendances

- **TASK-001** : Infrastructure Stripe
- Bloqué par rien, peut être fait en parallèle

## Risques

- **Perte d'événements** : Implémenter un système de récupération
- **Order des événements** : Gérer les événements out-of-order
- **Volume** : Prévoir la scalabilité

## Définition de "Done"

- [ ] Endpoint webhook fonctionnel
- [ ] Tous les événements critiques gérés
- [ ] Idempotence validée
- [ ] Documentation des événements
- [ ] Monitoring et alertes configurés

## Notes

- Toujours retourner 200 à Stripe, même en cas d'erreur
- Logger tous les événements pour audit
- Prévoir un dashboard pour visualiser les webhooks
- Implémenter un circuit breaker pour les erreurs répétées 