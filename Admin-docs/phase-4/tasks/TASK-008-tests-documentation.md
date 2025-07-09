# TASK-008: Tests et Documentation

**Type**: QA / Documentation  
**Priorité**: 🟡 Haute  
**Estimation**: 1.5 jours  
**Assigné à**: [Dev Backend] + [QA]  
**Sprint**: Phase 4 - Sprint 2  
**Dépend de**: TASK-001 à TASK-007  

## Description

Créer une suite de tests complète pour l'intégration Stripe et documenter toutes les fonctionnalités, configurations et processus opérationnels.

## Contexte

- Intégration critique nécessitant une couverture de tests élevée
- Besoin de documentation pour l'équipe et les opérations
- Tests E2E avec Stripe en mode test

## Critères d'acceptation

- [ ] Tests unitaires > 90% de couverture
- [ ] Tests d'intégration pour tous les flows
- [ ] Tests E2E avec webhooks réels (ngrok)
- [ ] Documentation API complète (Swagger)
- [ ] Guide de configuration Stripe
- [ ] Runbook opérationnel
- [ ] Documentation développeur

## Tâches techniques

### 1. Tests unitaires
```typescript
// stripe.service.spec.ts
describe('StripeService', () => {
  let service: StripeService;
  let mockStripe: DeepMocked<Stripe>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: STRIPE_CLIENT,
          useValue: createMock<Stripe>(),
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    mockStripe = module.get(STRIPE_CLIENT);
  });

  describe('createCustomer', () => {
    it('should create customer with correct data', async () => {
      const customerData = {
        email: 'test@example.com',
        name: 'Test User',
        metadata: { userId: '123' },
      };

      const mockCustomer = {
        id: 'cus_123',
        ...customerData,
      };

      mockStripe.customers.create.mockResolvedValue(mockCustomer);

      const result = await service.createCustomer(customerData);

      expect(mockStripe.customers.create).toHaveBeenCalledWith(customerData);
      expect(result).toEqual(mockCustomer);
    });

    it('should handle Stripe errors properly', async () => {
      mockStripe.customers.create.mockRejectedValue(
        new Stripe.errors.StripeAPIError({
          type: 'StripeAPIError',
          message: 'Invalid request',
        })
      );

      await expect(service.createCustomer({}))
        .rejects.toThrow(BadRequestException);
    });
  });
});
```

### 2. Tests d'intégration
```typescript
// subscription.service.integration.spec.ts
describe('SubscriptionService Integration', () => {
  let app: INestApplication;
  let subscriptionService: SubscriptionService;
  let stripeService: StripeService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    subscriptionService = app.get(SubscriptionService);
    stripeService = app.get(StripeService);
  });

  describe('Complete subscription flow', () => {
    it('should create subscription with consumption tracking', async () => {
      // 1. Créer un utilisateur test
      const user = await createTestUser();

      // 2. Créer une subscription
      const subscription = await subscriptionService.createSubscription(
        user.id,
        {
          planId: 'pro-plan-id',
          stripePriceId: 'price_123',
          billingCycle: 'monthly',
        }
      );

      expect(subscription.stripe_subscription_id).toBeDefined();
      expect(subscription.status).toBe('active');

      // 3. Vérifier que ConsumptionService est synchronisé
      const consumption = await consumptionService.getUserConsumption(user.id);
      expect(consumption.articles.limit).toBe(10); // Pro plan limit
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### 3. Tests E2E avec webhooks
```typescript
// webhooks.e2e-spec.ts
describe('Webhooks E2E', () => {
  let app: INestApplication;
  let webhookEndpoint: string;

  beforeAll(async () => {
    app = await createTestApp();
    
    // Utiliser ngrok pour exposer l'endpoint local
    const ngrokUrl = await ngrok.connect(3000);
    webhookEndpoint = `${ngrokUrl}/admin/billing/webhooks`;

    // Configurer le webhook dans Stripe
    await stripe.webhookEndpoints.create({
      url: webhookEndpoint,
      enabled_events: ['customer.subscription.updated'],
    });
  });

  it('should handle subscription update webhook', async () => {
    // 1. Créer une subscription dans Stripe
    const subscription = await stripe.subscriptions.create({
      customer: 'cus_test',
      items: [{ price: 'price_123' }],
    });

    // 2. Attendre le webhook
    await waitForWebhook('customer.subscription.created', subscription.id);

    // 3. Vérifier la synchronisation locale
    const localSub = await subscriptionRepo.findOne({
      where: { stripe_subscription_id: subscription.id },
    });

    expect(localSub).toBeDefined();
    expect(localSub.status).toBe('active');
  });

  afterAll(async () => {
    await ngrok.disconnect();
    await app.close();
  });
});
```

### 4. Documentation API Swagger
```typescript
// Ajouter les décorateurs Swagger sur tous les endpoints
@ApiTags('Admin - Subscriptions')
@Controller('admin/subscriptions')
@ApiBearerAuth()
export class AdminSubscriptionsController {
  @Post()
  @ApiOperation({ 
    summary: 'Create a new subscription',
    description: 'Creates a Stripe subscription and syncs with local database'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'User already has active subscription' 
  })
  async createSubscription(
    @Body() @ApiBody({ type: CreateSubscriptionDto }) dto: CreateSubscriptionDto
  ) {
    // ...
  }
}
```

### 5. Guide de configuration Stripe
```markdown
# Configuration Stripe - Guide

## 1. Prérequis
- Compte Stripe avec accès API
- Mode test activé pour le développement

## 2. Configuration des clés API

### Environnement de développement
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Obtenir les clés
1. Connectez-vous à [dashboard.stripe.com](https://dashboard.stripe.com)
2. Allez dans Developers > API keys
3. Copiez la clé secrète test

## 3. Configuration des webhooks

### Créer un endpoint webhook
1. Allez dans Developers > Webhooks
2. Cliquez sur "Add endpoint"
3. URL: `https://your-domain.com/admin/billing/webhooks`
4. Sélectionnez les événements :
   - customer.subscription.*
   - invoice.*
   - payment_intent.*

### Obtenir le secret webhook
1. Cliquez sur le webhook créé
2. Révélez et copiez le "Signing secret"

## 4. Synchronisation des plans

```bash
# Synchroniser les plans locaux avec Stripe
npm run stripe:sync:plans

# Vérifier la synchronisation
npm run stripe:verify:plans
```

## 5. Tests en local avec ngrok

```bash
# Installer ngrok
npm install -g ngrok

# Exposer votre serveur local
ngrok http 3000

# Utiliser l'URL ngrok pour les webhooks
```
```

### 6. Runbook opérationnel
```markdown
# Runbook - Gestion Stripe

## Opérations courantes

### 1. Ajouter des crédits manuellement
```bash
POST /admin/subscriptions/{id}/add-credits
{
  "articles": 5,
  "socialPosts": 10,
  "stories": 3
}
```

### 2. Vérifier la synchronisation
```sql
-- Subscriptions non synchronisées
SELECT * FROM subscriptions 
WHERE status = 'active' 
AND stripe_subscription_id IS NULL;

-- Événements webhook en échec
SELECT * FROM stripe_events 
WHERE status = 'failed' 
AND attempts < 3
ORDER BY created_at DESC;
```

### 3. Retraiter les webhooks échoués
```bash
npm run stripe:webhooks:retry
```

## Incidents courants

### Webhook timeout
**Symptômes**: Events en statut "failed"
**Solution**: 
1. Vérifier les logs
2. Retraiter manuellement via Stripe Dashboard
3. Lancer le job de retry

### Désynchronisation subscription
**Symptômes**: Statut différent entre Stripe et local
**Solution**:
1. Identifier via `/admin/subscriptions/sync/check`
2. Forcer la resync: `POST /admin/subscriptions/{id}/sync`

## Monitoring

### Métriques à surveiller
- Taux d'échec des webhooks < 1%
- Temps de traitement webhook < 5s
- Nombre de subscriptions désynchronisées = 0

### Alertes configurées
- Webhook failed > 10 en 5 minutes
- Subscription sans stripe_id après 1h
- Customer creation failed
```

### 7. Tests de performance
```typescript
// performance.test.ts
describe('Stripe Performance Tests', () => {
  it('should handle 100 concurrent webhook requests', async () => {
    const webhooks = Array(100).fill(null).map(() => 
      generateMockWebhook('customer.subscription.updated')
    );

    const startTime = Date.now();
    
    const results = await Promise.all(
      webhooks.map(webhook => 
        request(app.getHttpServer())
          .post('/admin/billing/webhooks')
          .set('stripe-signature', generateSignature(webhook))
          .send(webhook)
      )
    );

    const duration = Date.now() - startTime;

    expect(results.every(r => r.status === 200)).toBe(true);
    expect(duration).toBeLessThan(10000); // < 10 secondes
  });
});
```

## Tests requis

1. **Couverture de code**
   - Minimum 90% sur le module Stripe
   - 100% sur les handlers critiques

2. **Tests de régression**
   - Tous les bugs fixés ont un test

3. **Tests de sécurité**
   - Validation des signatures webhook
   - Protection contre les replay attacks

## Dépendances

- Toutes les tâches précédentes complétées
- Environnement de test Stripe configuré

## Risques

- **Tests flaky** : Dépendance sur API externe
- **Coût des tests** : Utiliser le mode test
- **Documentation obsolète** : Maintenir à jour

## Définition de "Done"

- [ ] Tests unitaires passants (> 90% coverage)
- [ ] Tests d'intégration validés
- [ ] Tests E2E avec webhooks réels
- [ ] Documentation Swagger complète
- [ ] Guide de configuration finalisé
- [ ] Runbook opérationnel validé
- [ ] Tests de performance passants

## Notes

- Utiliser les fixtures Stripe pour les tests
- Documenter tous les cas d'erreur
- Inclure des exemples de code dans la doc
- Prévoir une formation pour l'équipe support 