# TASK-007: Flow Utilisateur d'Abonnement

**Type**: Backend Development  
**Priorité**: 🔴 Critique  
**Estimation**: 2 jours  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 2  
**Dépend de**: TASK-001, TASK-002, TASK-004  

## Description

Implémenter le flow complet d'abonnement pour les utilisateurs finaux via Stripe Checkout. Les utilisateurs peuvent s'abonner, changer de plan, et annuler leur abonnement directement depuis le frontend.

## Contexte

- Les utilisateurs gèrent leurs abonnements via le frontend
- Redirection vers Stripe Checkout pour les paiements
- Synchronisation automatique via webhooks (TASK-004)
- Les admins ont des outils de monitoring (TASK-003)

## Critères d'acceptation

- [ ] Création de session Stripe Checkout pour abonnement
- [ ] Gestion des upgrades/downgrades utilisateur
- [ ] Annulation d'abonnement côté utilisateur
- [ ] Gestion du portail client Stripe
- [ ] Endpoints pour récupérer l'état de l'abonnement
- [ ] Synchronisation avec les webhooks

## Tâches techniques

### 1. Endpoints utilisateur

```typescript
// user-subscriptions.controller.ts
@Controller('subscriptions')
export class UserSubscriptionsController {
  constructor(
    private subscriptionService: SubscriptionService,
    private stripeService: StripeService,
  ) {}

  @Get('current')
  async getCurrentSubscription(@Req() req: any) {
    const user = await this.userService.findOneWithSubscription(req.user.id);
    return {
      subscription: user.subscription,
      plan: user.subscription?.plan,
      consumption: await this.consumptionService.getUserConsumption(req.user.id),
    };
  }

  @Post('checkout')
  async createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @Req() req: any
  ) {
    const user = await this.userService.findOne(req.user.id);
    
    // Vérifier si l'utilisateur peut s'abonner
    if (user.subscription?.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('User already has active subscription');
    }

    // Récupérer le plan et son prix Stripe
    const plan = await this.planService.findOne(dto.planId);
    const priceId = dto.billingCycle === 'yearly' 
      ? plan.stripe_price_id_yearly 
      : plan.stripe_price_id_monthly;

    // Créer la session Stripe Checkout
    const session = await this.stripeService.createCheckoutSession({
      customer_email: user.email,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user.id,
        planId: dto.planId,
        billingCycle: dto.billingCycle,
      },
    });

    return {
      checkout_url: session.url,
      session_id: session.id,
    };
  }

  @Post('change-plan')
  async changePlan(
    @Body() dto: ChangePlanDto,
    @Req() req: any
  ) {
    const user = await this.userService.findOneWithSubscription(req.user.id);
    
    if (!user.subscription?.stripe_subscription_id) {
      throw new BadRequestException('No active subscription found');
    }

    // Récupérer le nouveau plan
    const newPlan = await this.planService.findOne(dto.newPlanId);
    const newPriceId = dto.billingCycle === 'yearly'
      ? newPlan.stripe_price_id_yearly
      : newPlan.stripe_price_id_monthly;

    // Créer une session pour le changement de plan
    const session = await this.stripeService.createCheckoutSession({
      customer: user.subscription.stripe_customer_id,
      line_items: [{
        price: newPriceId,
        quantity: 1,
      }],
      mode: 'subscription',
      subscription_data: {
        proration_behavior: 'create_prorations',
      },
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user.id,
        planId: dto.newPlanId,
        billingCycle: dto.billingCycle,
        action: 'change_plan',
      },
    });

    return {
      checkout_url: session.url,
      session_id: session.id,
    };
  }

  @Post('cancel')
  async cancelSubscription(@Req() req: any) {
    const user = await this.userService.findOneWithSubscription(req.user.id);
    
    if (!user.subscription?.stripe_subscription_id) {
      throw new BadRequestException('No active subscription found');
    }

    // Annuler à la fin de la période
    await this.stripeService.cancelSubscription(
      user.subscription.stripe_subscription_id,
      true // cancel_at_period_end
    );

    return {
      message: 'Subscription will be canceled at the end of the current period',
      canceled_at_period_end: true,
    };
  }

  @Post('reactivate')
  async reactivateSubscription(@Req() req: any) {
    const user = await this.userService.findOneWithSubscription(req.user.id);
    
    if (!user.subscription?.stripe_subscription_id) {
      throw new BadRequestException('No subscription found');
    }

    // Réactiver l'abonnement
    await this.stripeService.updateSubscription(
      user.subscription.stripe_subscription_id,
      {
        cancel_at_period_end: false,
      }
    );

    return {
      message: 'Subscription reactivated successfully',
    };
  }

  @Get('portal')
  async getCustomerPortal(@Req() req: any) {
    const user = await this.userService.findOneWithSubscription(req.user.id);
    
    if (!user.subscription?.stripe_customer_id) {
      throw new BadRequestException('No customer found');
    }

    // Créer une session pour le portail client
    const session = await this.stripeService.createCustomerPortalSession({
      customer: user.subscription.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/subscription`,
    });

    return {
      portal_url: session.url,
    };
  }
}
```

### 2. DTOs

```typescript
// dto/create-checkout-session.dto.ts
export class CreateCheckoutSessionDto {
  @IsUUID()
  planId: string;

  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';
}

// dto/change-plan.dto.ts
export class ChangePlanDto {
  @IsUUID()
  newPlanId: string;

  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';
}
```

### 3. Service étendu

```typescript
// Ajouter dans StripeService
async createCheckoutSession(params: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Checkout.Session> {
  try {
    Logger.info('Creating checkout session', { params });
    
    const session = await this.stripe.checkout.sessions.create(params);
    
    await this.logAuditEvent('stripe.checkout.session.created', {
      sessionId: session.id,
      customerId: session.customer,
      mode: session.mode,
      amount: session.amount_total,
    });

    return session;
  } catch (error) {
    throw this.handleStripeError(error, 'Failed to create checkout session');
  }
}

async createCustomerPortalSession(params: Stripe.BillingPortal.SessionCreateParams): Promise<Stripe.BillingPortal.Session> {
  try {
    Logger.info('Creating customer portal session', { customerId: params.customer });
    
    const session = await this.stripe.billingPortal.sessions.create(params);
    
    await this.logAuditEvent('stripe.portal.session.created', {
      sessionId: session.id,
      customerId: session.customer,
    });

    return session;
  } catch (error) {
    throw this.handleStripeError(error, 'Failed to create portal session');
  }
}
```

### 4. Module utilisateur

```typescript
// user-subscriptions.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription, Plan]),
    StripeModule,
    ConsumptionModule,
  ],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}
```

## Endpoints finaux

### Consultation
- `GET /subscriptions/current` - État actuel de l'abonnement + consommation

### Abonnement
- `POST /subscriptions/checkout` - Créer session Stripe Checkout
- `POST /subscriptions/change-plan` - Changer de plan
- `POST /subscriptions/cancel` - Annuler (fin de période)
- `POST /subscriptions/reactivate` - Réactiver avant fin de période

### Gestion
- `GET /subscriptions/portal` - Accès au portail client Stripe

## Flow complet

### 1. Nouvel abonnement
```
1. User: POST /subscriptions/checkout
2. Backend: Crée session Stripe Checkout
3. Frontend: Redirige vers session.url
4. User: Paye sur Stripe
5. Stripe: Webhook → Backend
6. Backend: Crée/met à jour subscription
```

### 2. Changement de plan
```
1. User: POST /subscriptions/change-plan
2. Backend: Crée session avec prorata
3. Frontend: Redirige vers Stripe
4. User: Confirme le changement
5. Stripe: Webhook → Backend
6. Backend: Met à jour subscription
```

### 3. Annulation
```
1. User: POST /subscriptions/cancel
2. Backend: Stripe cancel_at_period_end=true
3. Stripe: Webhook → Backend
4. Backend: Met à jour subscription
```

## Dépendances

- **TASK-001** : StripeService requis
- **TASK-002** : Plans avec stripe_price_id
- **TASK-004** : Webhooks pour synchronisation
- **Frontend** : Intégration des redirections

## Risques

- **Double abonnement** : Vérifier les états avant création
- **Synchronisation** : Délai entre paiement et webhook
- **Erreurs de paiement** : Gestion des échecs
- **URLs de retour** : Configuration correcte frontend/backend

## Définition de "Done"

- [ ] Tous les endpoints fonctionnels
- [ ] Intégration Stripe Checkout validée
- [ ] Gestion des erreurs robuste
- [ ] Synchronisation avec webhooks
- [ ] Tests d'intégration complets
- [ ] Documentation API

## Notes

- Cette tâche est complémentaire aux webhooks (TASK-004)
- Les webhooks sont critiques pour la synchronisation
- Prévoir des timeouts et retry pour les appels Stripe
- Tester tous les cas d'erreur de paiement 