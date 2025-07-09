# TASK-008: Restructuration Plans & Frontend Intelligent

**Type**: Backend + Frontend Development  
**Priorité**: 🔴 Critique  
**Estimation**: 1.5 jours  
**Assigné à**: [Dev Full-Stack]  
**Sprint**: Phase 4 - Sprint 3  
**Dépend de**: TASK-007  

## Description

Restructurer complètement la gestion des plans pour éliminer le hardcode frontend et implémenter une logique intelligente d'upgrade/downgrade avec UX contextuelle.

## Contexte

### Problèmes actuels identifiés
- ❌ Plans hardcodés dans le frontend (duplication backend/frontend)
- ❌ Features hardcodées sans multilingue
- ❌ Logique simpliste (pas de distinction upgrade/downgrade)
- ❌ UX confuse (pas d'indication du plan actuel)
- ❌ Maintenance difficile (changement en base = changement en front)

### Objectifs
- ✅ Plans 100% dynamiques depuis l'API
- ✅ Features multilingues en base de données
- ✅ Logique intelligente upgrade/downgrade
- ✅ UX contextuelle avec plan actuel
- ✅ Gestion flexible des cycles de facturation

## Critères d'acceptation

- [ ] Plans récupérés dynamiquement depuis l'API
- [ ] Features multilingues stockées en base
- [ ] Features organisées par catégories (Contenu, Distribution, Support)
- [ ] Logique intelligente de changement de plan
- [ ] Modal avec indication du plan actuel
- [ ] Boutons contextuels (Upgrade/Downgrade/Actuel)
- [ ] Gestion des cycles monthly ↔ yearly
- [ ] Conservation des crédits jusqu'à fin de période

## Implémentation

### ÉTAPE 1: Features multilingues en base (25 min)

#### 1.1 Migration enrichissement features

```sql
-- Migration: EnrichPlanFeatures
-- Enrichir le champ features JSON avec structure multilingue

UPDATE plans SET features = JSON_OBJECT(
  'features', JSON_ARRAY(
    JSON_OBJECT(
      'key', 'articles_monthly',
      'text', JSON_OBJECT(
        'fr', CONCAT(articles_limit, ' articles par mois'),
        'en', CONCAT(articles_limit, ' articles per month'),
        'he', CONCAT(articles_limit, ' מאמרים בחודש')
      ),
      'included', true,
      'category', 'content'
    ),
    JSON_OBJECT(
      'key', 'social_posts_monthly', 
      'text', JSON_OBJECT(
        'fr', CONCAT(social_posts_limit, ' posts sociaux par mois'),
        'en', CONCAT(social_posts_limit, ' social posts per month'),
        'he', CONCAT(social_posts_limit, ' פוסטים חברתיים בחודש')
      ),
      'included', true,
      'category', 'content'
    )
    -- ... autres features
  )
) WHERE name = 'free';

-- Répéter pour basic, pro
```

#### 1.2 Structure features par plan

**Plan Free:**
```json
{
  "features": [
    {
      "key": "articles_trial",
      "text": {
        "fr": "3 articles le 1er mois (puis 1 article)",
        "en": "3 articles first month (then 1 article)",
        "he": "3 מאמרים בחודש הראשון (אז מאמר אחד)"
      },
      "included": true,
      "category": "content"
    },
    {
      "key": "platforms_limited",
      "text": {
        "fr": "Post sur Facebook et Instagram seulement",
        "en": "Post on Facebook and Instagram only",
        "he": "פרסום בפייסבוק ואינסטגרם בלבד"
      },
      "included": true,
      "category": "distribution"
    },
    {
      "key": "stories_option",
      "text": {
        "fr": "Story en option",
        "en": "Story as option",
        "he": "סטורי כאופציה"
      },
      "included": true,
      "category": "content"
    },
    {
      "key": "support_none",
      "text": {
        "fr": "Pas de support",
        "en": "No support",
        "he": "ללא תמיכה"
      },
      "included": false,
      "category": "support"
    }
  ]
}
```

**Plan Basic:**
```json
{
  "features": [
    {
      "key": "articles_monthly_3",
      "text": {
        "fr": "3 articles par mois",
        "en": "3 articles per month",
        "he": "3 מאמרים בחודש"
      },
      "included": true,
      "category": "content"
    },
    {
      "key": "platforms_extended",
      "text": {
        "fr": "Post sur Facebook, Instagram, X, LinkedIn",
        "en": "Post on Facebook, Instagram, X, LinkedIn",
        "he": "פרסום בפייסבוק, אינסטגרם, X, לינקדאין"
      },
      "included": true,
      "category": "distribution"
    },
    {
      "key": "whatsapp_email",
      "text": {
        "fr": "WhatsApp et Email inclus",
        "en": "WhatsApp and Email included",
        "he": "וואטסאפ ואימייל כלולים"
      },
      "included": true,
      "category": "distribution"
    },
    {
      "key": "stories_facebook_instagram",
      "text": {
        "fr": "Story Facebook et Instagram",
        "en": "Facebook and Instagram Stories",
        "he": "סטורי פייסבוק ואינסטגרם"
      },
      "included": true,
      "category": "content"
    },
    {
      "key": "regenerations_5",
      "text": {
        "fr": "5 régénérations de posts",
        "en": "5 post regenerations",
        "he": "5 יצירות מחדש של פוסטים"
      },
      "included": true,
      "category": "content"
    },
    {
      "key": "support_email_chat",
      "text": {
        "fr": "Support email/chat",
        "en": "Email/chat support",
        "he": "תמיכה באימייל/צ'אט"
      },
      "included": true,
      "category": "support"
    }
  ]
}
```

### ÉTAPE 2: Plans dynamiques API (30 min)

#### 2.1 Endpoint GET /plans

```typescript
// plans.controller.ts (nouveau)
@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  @Public() // Accessible sans authentification
  async getAllPlans(@Query('lang') lang: string = 'fr') {
    return this.plansService.getAllPlansWithFeatures(lang);
  }
}

// plans.service.ts
async getAllPlansWithFeatures(lang: string = 'fr') {
  const plans = await this.planRepository.find({
    where: { is_active: true },
    order: { monthly_price: 'ASC' }
  });

  return plans.map(plan => ({
    ...plan,
    features: this.extractFeaturesForLang(plan.features, lang),
    pricing: {
      monthly: parseFloat(plan.monthly_price),
      yearly: parseFloat(plan.yearly_price),
      yearlyDiscount: plan.yearly_discount_percent
    }
  }));
}

private extractFeaturesForLang(featuresJson: any, lang: string) {
  if (!featuresJson?.features) return [];
  
  return featuresJson.features.map(feature => ({
    key: feature.key,
    text: feature.text[lang] || feature.text.fr,
    included: feature.included,
    category: feature.category
  }));
}
```

#### 2.2 Frontend - Hook usePlans

```typescript
// hooks/usePlans.ts
export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/plans?lang=${i18n.language}`);
      setPlans(data.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, refetch: fetchPlans };
};
```

### ÉTAPE 3: Logique intelligente changement de plan (25 min)

#### 3.1 Endpoint POST /subscriptions/change

```typescript
// user-subscriptions.controller.ts
@Post('change')
async changePlan(
  @Body() dto: ChangePlanDto,
  @Req() req: any
) {
  return this.userSubscriptionsService.intelligentPlanChange(
    req.user.id, 
    dto.newPlanId, 
    dto.billingCycle
  );
}

// user-subscriptions.service.ts
async intelligentPlanChange(
  userId: string,
  newPlanId: string,
  billingCycle: 'monthly' | 'yearly'
) {
  const user = await this.findUserWithSubscription(userId);
  const newPlan = await this.findPlan(newPlanId);
  const currentPlan = user.subscription?.plan;

  // Déterminer le type de changement
  const changeType = this.determineChangeType(currentPlan, newPlan, billingCycle);

  switch (changeType) {
    case 'upgrade':
      return this.processUpgrade(user, newPlan, billingCycle);
    case 'downgrade':
      return this.processDowngrade(user, newPlan, billingCycle);
    case 'cycle_change':
      return this.processCycleChange(user, billingCycle);
    case 'same':
      throw new BadRequestException('Plan identique sélectionné');
  }
}

private determineChangeType(currentPlan: Plan, newPlan: Plan, newCycle: string) {
  if (!currentPlan) return 'upgrade'; // Free vers payant
  
  const currentPrice = parseFloat(currentPlan.monthly_price);
  const newPrice = parseFloat(newPlan.monthly_price);
  
  if (currentPlan.id === newPlan.id) {
    return 'cycle_change'; // Même plan, cycle différent
  }
  
  return newPrice > currentPrice ? 'upgrade' : 'downgrade';
}
```

#### 3.2 Gestion des règles métier

```typescript
private async processUpgrade(user: User, newPlan: Plan, billingCycle: string) {
  // Upgrade = effet immédiat avec prorata
  const priceId = billingCycle === 'yearly' 
    ? newPlan.stripe_price_id_yearly 
    : newPlan.stripe_price_id_monthly;

  if (user.subscription?.stripe_subscription_id) {
    // Utilisateur avec abonnement Stripe existant
    return this.stripeService.createCheckoutSession({
      customer: user.subscription.stripe_customer_id,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: { proration_behavior: 'create_prorations' },
      // URLs...
    });
  } else {
    // Utilisateur Free vers payant
    return this.stripeService.createCheckoutSession({
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      // URLs...
    });
  }
}

private async processDowngrade(user: User, newPlan: Plan, billingCycle: string) {
  // Downgrade = fin de période, conservation des crédits
  if (newPlan.name === 'free') {
    // Downgrade vers Free = annulation
    await this.stripeService.cancelSubscription(
      user.subscription.stripe_subscription_id,
      true // cancel_at_period_end
    );
    return { message: 'Downgrade vers Free programmé en fin de période' };
  } else {
    // Downgrade vers plan payant inférieur
    // Programmer le changement en fin de période
    // (nécessite logique custom ou Stripe scheduled changes)
    return { message: 'Downgrade programmé en fin de période' };
  }
}
```

### ÉTAPE 4: UX contextuelle améliorée (15 min)

#### 4.1 Hook useSubscriptionContext

```typescript
// hooks/useSubscriptionContext.ts
export const useSubscriptionContext = () => {
  const { plans } = usePlans();
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const enrichPlansWithContext = useCallback(() => {
    if (!currentSubscription || !plans.length) return plans;

    return plans.map(plan => {
      const isCurrentPlan = plan.id === currentSubscription.plan?.id;
      const currentPrice = parseFloat(currentSubscription.plan?.monthly_price || '0');
      const planPrice = parseFloat(plan.monthly_price);

      return {
        ...plan,
        context: {
          isCurrent: isCurrentPlan,
          isUpgrade: planPrice > currentPrice,
          isDowngrade: planPrice < currentPrice,
          buttonText: isCurrentPlan 
            ? 'Plan actuel' 
            : planPrice > currentPrice 
              ? `Upgrade vers ${plan.display_name}`
              : `Downgrade vers ${plan.display_name}`
        }
      };
    });
  }, [plans, currentSubscription]);

  return {
    plans: enrichPlansWithContext(),
    currentSubscription,
    setCurrentSubscription
  };
};
```

#### 4.2 Composant PricingModal intelligent

```typescript
// components/PricingModal/index.tsx
export default function PricingModal({ isOpen, onClose, currentQuotaType }: PricingModalProps) {
  const { plans, currentSubscription } = useSubscriptionContext();
  const { changePlan, loading, error } = useSubscription();
  const { t, i18n } = useTranslation();

  const groupedFeatures = useMemo(() => {
    return plans.map(plan => ({
      ...plan,
      featuresGrouped: {
        content: plan.features.filter(f => f.category === 'content'),
        distribution: plan.features.filter(f => f.category === 'distribution'),
        support: plan.features.filter(f => f.category === 'support'),
      }
    }));
  }, [plans]);

  const handleSelectPlan = async (plan: PlanWithContext) => {
    if (plan.context.isCurrent) return;

    try {
      const result = await changePlan(plan.id, 'monthly');
      if (result?.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (err) {
      console.error('Erreur changement plan:', err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      {/* Header avec plan actuel */}
      <div className={styles.currentPlanBanner}>
        Plan actuel: {currentSubscription?.plan?.display_name}
      </div>

      {/* Grille des plans */}
      <div className={styles.plansGrid}>
        {groupedFeatures.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelectPlan}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
```

## Flow complet

### 1. Chargement initial
```
1. Frontend: usePlans() → GET /plans?lang=fr
2. Frontend: useSubscription() → GET /subscriptions/current
3. Frontend: useSubscriptionContext() → Enrichit plans avec contexte
```

### 2. Changement de plan
```
1. User: Clique "Upgrade vers Pro"
2. Frontend: POST /subscriptions/change { newPlanId, billingCycle }
3. Backend: Analyse upgrade/downgrade
4. Backend: Crée session Stripe appropriée
5. Frontend: Redirection vers Stripe
6. Stripe: Webhook → Synchronisation
```

### 3. Gestion des cas spéciaux
```
- Free → Basic: Checkout normal
- Basic → Pro: Upgrade avec prorata
- Pro → Basic: Downgrade fin période
- Pro → Free: Annulation fin période
- Monthly ↔ Yearly: Changement fin période
```

## Risques et considérations

### Risques techniques
- **Migration features** : Données existantes à préserver
- **Traductions** : Cohérence multilingue
- **Stripe limitations** : Certains changements nécessitent workarounds

### Considérations UX
- **Clarté des impacts** : Utilisateur doit comprendre quand le changement prend effet
- **Conservation crédits** : Bien expliquer que les crédits sont conservés
- **Rollback** : Possibilité d'annuler un changement programmé

## Définition de "Done"

- [ ] Migration features exécutée avec succès
- [ ] Endpoint GET /plans fonctionnel multilingue
- [ ] Frontend utilise plans dynamiques
- [ ] Logique intelligente upgrade/downgrade
- [ ] UX contextuelle avec plan actuel
- [ ] Tests complets des flows
- [ ] Documentation utilisateur

## Notes d'implémentation

- Prévoir fallback si API plans indisponible
- Cache des plans côté frontend (5 minutes)
- Logs détaillés pour debug changements plans
- Monitoring des erreurs Stripe
- Tests E2E pour tous les scénarios 