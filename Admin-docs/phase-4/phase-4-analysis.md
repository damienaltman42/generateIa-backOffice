# Analyse Phase 4 - Intégration Stripe (Janvier 2025)

## État actuel du code

### 1. Infrastructure en place

#### Entités préparées
- **Subscription** : Colonnes Stripe déjà présentes
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `stripe_payment_method_id`
  - Statuts : `trial`, `active`, `past_due`, `canceled`, `expired`
  - Cycles de facturation : `monthly`, `yearly`

- **Plan** : Structure complète
  - Prix mensuels et annuels
  - Prix des crédits supplémentaires (3€ par défaut)
  - Limites et configurations

#### Services existants
- **AdminUsersService**
  - `getPaymentInfo()` : Stub en place, retourne des TODO
  - `calculateTotalSpent()` : Calcul simplifié sans Stripe

- **DashboardService**
  - `calculateMRR()` : Calcul du MRR basé sur les plans locaux

### 2. Ce qui manque

#### Infrastructure Stripe
- ❌ SDK Stripe non installé (`npm install stripe`)
- ❌ Configuration Stripe (clés API)
- ❌ Module Stripe dédié

#### Endpoints manquants
- ❌ `/admin/subscriptions` (CRUD)
- ❌ `/admin/billing/webhooks` (Webhooks Stripe)
- ❌ `/admin/invoices` (Factures)
- ❌ `/admin/payment-methods` (Moyens de paiement)

#### Services manquants
- ❌ StripeService (wrapper SDK)
- ❌ BillingService (logique métier)
- ❌ WebhookService (traitement événements)
- ❌ InvoiceService (gestion factures)

### 3. Évolutions depuis le plan initial

#### Phase 7 complétée
- ✅ Système de quotas complet
- ✅ Gestion des crédits supplémentaires
- ✅ Période de facturation dans Subscription
- ✅ ConsumptionHistory pour tracking

#### Nouvelles tables
- `consumption_history` : Historique détaillé
- `audit_logs` : Traçabilité complète
- Seeds pour plans Free/Pro

## Ajustements du plan Phase 4

### 1. Ordre d'implémentation recommandé

#### Étape 1 : Infrastructure de base
1. Installer SDK Stripe
2. Créer StripeModule avec configuration
3. Créer StripeService (wrapper SDK)
4. Tests unitaires du wrapper

#### Étape 2 : Synchronisation des plans
1. Créer/synchroniser les plans dans Stripe
2. Mapper les plan_id locaux avec Stripe price_id
3. Migration pour ajouter `stripe_price_id` dans plans

#### Étape 3 : Gestion des subscriptions
1. Créer AdminSubscriptionsController
2. Endpoint de création de subscription Stripe
3. Endpoint de modification (upgrade/downgrade)
4. Endpoint d'annulation

#### Étape 4 : Webhooks
1. Endpoint `/admin/billing/webhooks`
2. Validation signature Stripe
3. Handlers pour chaque événement :
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

#### Étape 5 : Factures et paiements
1. Récupération des factures Stripe
2. Stockage local des références
3. Endpoint de téléchargement PDF
4. Historique des paiements

### 2. Points d'attention spécifiques

#### Gestion des crédits supplémentaires
- Les `extra_*_purchased` sont maintenant dans Subscription
- Créer des "price" Stripe pour chaque type de crédit
- Utiliser Stripe Checkout ou Invoice Items

#### Synchronisation des périodes
- La phase 7 utilise `current_period_start/end`
- Synchroniser avec les périodes Stripe
- Gérer le passage à la nouvelle période

#### Migration des utilisateurs existants
- Créer des customers Stripe pour les users existants
- Migrer les subscriptions actives
- Conserver l'historique

### 3. Sécurité renforcée

#### Webhooks
```typescript
// Validation obligatoire
const sig = request.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  rawBody,
  sig,
  endpointSecret
);
```

#### Idempotence
- Stocker les event_id traités
- Rejeter les doublons

### 4. Tests recommandés

#### Tests E2E prioritaires
1. Création de subscription complète
2. Upgrade/downgrade avec prorata
3. Gestion des échecs de paiement
4. Annulation et réactivation

#### Tests d'intégration
- Webhooks avec différents scénarios
- Synchronisation bi-directionnelle
- Gestion des erreurs réseau

## Estimation ajustée

### Temps par sous-tâche

1. **SDK et configuration** : 0.5 jour
2. **Endpoints subscriptions** : 2 jours
3. **Webhooks complets** : 2 jours
4. **Factures et historique** : 1 jour
5. **Tests et documentation** : 1.5 jours

**Total Phase 4** : 7 jours (vs 5-7 jours estimés)

## Dépendances

### Nouvelles dépendances npm
```json
{
  "stripe": "^14.x",
  "@types/stripe": "^14.x"
}
```

### Variables d'environnement
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2023-10-16
```

## Risques identifiés

1. **Désynchronisation** : Les statuts peuvent diverger
   - Solution : Webhook handler robuste avec retry

2. **Double facturation** : Crédits extras + subscription
   - Solution : Utiliser Invoice Items Stripe

3. **Migration des données** : Utilisateurs existants
   - Solution : Script de migration progressif

## Prochaines étapes

1. Valider le plan ajusté avec l'équipe
2. Installer les dépendances Stripe
3. Créer la structure de base (module, service, config)
4. Implémenter par ordre de priorité 