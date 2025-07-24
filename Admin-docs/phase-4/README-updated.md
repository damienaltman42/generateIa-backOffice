# Phase 4 — Intégration Stripe & Billing (Version Révisée)

## Objectif général
Permettre la gestion complète, sécurisée et traçable des abonnements utilisateurs via Stripe, avec synchronisation des statuts, gestion des plans, facturation, webhooks et conformité.

## Contexte actuel
- ✅ Infrastructure de base prête (entités avec colonnes Stripe)
- ✅ Phase 7 complétée (système de quotas et crédits supplémentaires)
- ✅ Plans Free/Pro définis dans la base
- ✅ TASK-001 : Infrastructure Stripe (complétée)
- ✅ TASK-002 : Synchronisation des plans (complétée)

---

## Epic 6 : Stripe & Gestion des abonnements (Révisé)

### Objectifs
- Intégrer Stripe pour la gestion des abonnements, paiements et plans d'utilisateurs
- Synchroniser en temps réel les statuts d'abonnement entre Stripe et la BDD locale
- Permettre aux utilisateurs de gérer leurs abonnements via le frontend
- Fournir aux admins des outils de monitoring et correction
- Garantir la sécurité, la traçabilité et la conformité RGPD/SOC2

### Ordre de priorité révisé

#### 🔴 CRITIQUE - Sprint 1

##### TASK-004: Webhooks Stripe (Priorité 1)
- **Estimation**: 2 jours
- **Status**: 🔴 Critique
- **Objectif**: Synchronisation automatique des événements Stripe
- **Endpoints**: `POST /admin/billing/webhooks`
- **Événements**: subscription.*, invoice.*, payment.*
- **Pourquoi critique**: Base de toute synchronisation automatique

##### TASK-007: Flow Utilisateur d'Abonnement (Priorité 2)
- **Estimation**: 2 jours  
- **Status**: 🔴 Critique
- **Objectif**: Permettre aux utilisateurs de s'abonner via Stripe Checkout
- **Endpoints**: 
  - `GET /subscriptions/current`
  - `POST /subscriptions/checkout`
  - `POST /subscriptions/cancel`
  - `POST /subscriptions/change-plan`
  - `GET /subscriptions/portal`
- **Pourquoi critique**: Fonctionnalité métier principale

#### 🟡 HAUTE - Sprint 1

##### TASK-003: Gestion Admin des Subscriptions (Priorité 3)
- **Estimation**: 1.5 jours
- **Status**: 🟡 Moyenne  
- **Objectif**: Outils admin pour monitoring et correction
- **Endpoints**:
  - `GET /admin/subscriptions` (listing + filtres)
  - `GET /admin/subscriptions/:id` (détail)
  - `PATCH /admin/subscriptions/:id/status` (correction statut)
  - `POST /admin/subscriptions/:id/sync` (resync Stripe)
  - `POST /admin/subscriptions/:id/add-credits` (crédits gratuits)
- **Pourquoi important**: Outils de gestion et correction

#### 🟢 MOYENNE - Sprint 2

##### TASK-005: Gestion des Factures (Priorité 4)
- **Estimation**: 1.5 jours
- **Status**: 🟢 Moyenne
- **Objectif**: Consultation et gestion des factures
- **Endpoints**: `/admin/invoices/*`

##### TASK-006: Crédits Supplémentaires (Priorité 5)
- **Estimation**: 1 jour
- **Status**: 🟢 Basse
- **Objectif**: Achat de crédits supplémentaires
- **Note**: Peut être fait via Invoice Items

---

## Architecture révisée

### Flow Utilisateur (Principal)
```
1. User clique "S'abonner" → Frontend
2. POST /subscriptions/checkout → Backend
3. Backend crée Stripe Checkout Session
4. Redirection vers Stripe
5. User paye sur Stripe
6. Stripe webhook → POST /admin/billing/webhooks
7. Backend synchronise subscription
8. User redirigé vers success page
```

### Flow Admin (Support)
```
1. Admin consulte → GET /admin/subscriptions
2. Admin corrige statut → PATCH /admin/subscriptions/:id/status
3. Admin resync → POST /admin/subscriptions/:id/sync
4. Admin ajoute crédits → POST /admin/subscriptions/:id/add-credits
```

### Architecture technique

#### Modules
```
src/admin/modules/subscriptions/
├── subscription.module.ts
├── subscription.service.ts
├── admin-subscriptions.controller.ts (admin)
├── user-subscriptions.controller.ts (users)
├── webhook.controller.ts (webhooks)
└── dto/

src/lib/stripe/ (existant)
├── stripe.service.ts
└── stripe.module.ts
```

#### Base de données
- `subscriptions` (existant) - Données principales
- `stripe_events` (nouveau) - Idempotence webhooks
- `consumption_history` (existant) - Quotas
- `audit_logs` (existant) - Traçabilité

---

## Changements par rapport au plan initial

### ❌ Supprimé
- Endpoints admin pour créer/modifier les abonnements
- Gestion du prorata côté admin
- Création manuelle de customers

### ✅ Ajouté
- TASK-007 : Flow utilisateur complet
- Stripe Checkout integration
- Customer Portal Stripe
- Correction manuelle des statuts admin

### 🔄 Modifié
- TASK-003 : Focus sur monitoring/correction vs création
- TASK-004 : Priorité critique (était moyenne)
- Architecture : Séparation user/admin controllers

---

## Définition de "Done" globale

### Sprint 1 (Critique)
- [ ] Webhooks fonctionnels et testés
- [ ] Flow utilisateur d'abonnement complet
- [ ] Outils admin de base opérationnels
- [ ] Synchronisation Stripe ↔ Backend validée

### Sprint 2 (Complémentaire)
- [ ] Gestion des factures
- [ ] Crédits supplémentaires
- [ ] Monitoring avancé
- [ ] Documentation complète

### Critères techniques
- [ ] Tests d'intégration avec Stripe
- [ ] Gestion d'erreurs robuste
- [ ] Logs et audit complets
- [ ] Sécurité validée (signatures, HTTPS)
- [ ] Performance acceptable (<2s pour checkout)

---

## Notes importantes

### Sécurité
- Validation des signatures webhooks obligatoire
- HTTPS requis pour tous les endpoints Stripe
- Logs de toutes les actions sensibles

### Idempotence
- Table `stripe_events` pour éviter les doublons
- Retry automatique des webhooks échoués
- Gestion des événements out-of-order

### Monitoring
- Dashboard pour visualiser les webhooks
- Alertes en cas d'échec répété
- Métriques sur les conversions

### Tests
- Tests unitaires pour tous les services
- Tests d'intégration avec Stripe Test Mode
- Tests E2E du flow complet utilisateur

---

### Livrables attendus
- Module Stripe complet et testé
- API d'abonnement fonctionnelle
- Webhooks robustes avec retry
- Synchronisation fiable bidirectionnelle
- Gestion des crédits intégrée
- Documentation complète

---

### Critères de succès
- Zéro désynchronisation entre Stripe et la BDD locale
- Webhooks traités en moins de 5 secondes
- Aucune perte de données en cas d'erreur
- Tests couvrant 90% du code Stripe
- Documentation claire pour l'équipe

---

### Points de vigilance spécifiques

#### Synchronisation des périodes
- Les périodes de ConsumptionService utilisent `current_period_start/end`
- Synchroniser ces dates avec les événements Stripe
- Gérer le renouvellement automatique des quotas

#### Gestion des crédits
- Les crédits sont dans `subscription.extra_*_purchased`
- Utiliser Stripe Invoice Items pour la facturation
- Confirmer l'ajout uniquement après paiement réussi

#### Sécurité
- Validation stricte des webhooks (signature)
- Idempotence obligatoire (table stripe_events)
- Logs détaillés pour audit
- Chiffrement des données sensibles

#### Migration
- Ne pas interrompre le service existant
- Mode read-only pendant la migration
- Rollback plan en cas d'échec

---

### Architecture technique

```
admin/modules/
├── stripe/
│   ├── stripe.module.ts
│   ├── stripe.service.ts
│   ├── stripe.config.ts
│   └── tests/
├── billing/
│   ├── billing.module.ts
│   ├── controllers/
│   │   ├── subscriptions.controller.ts
│   │   ├── webhooks.controller.ts
│   │   └── invoices.controller.ts
│   ├── services/
│   │   ├── subscription.service.ts
│   │   ├── webhook.service.ts
│   │   └── invoice.service.ts
│   └── entities/
│       ├── invoice.entity.ts
│       └── stripe-event.entity.ts
```

---

### Estimation finale
**Total : 8.5 jours** (incluant tests et documentation)

### Ordre de priorité
1. Infrastructure Stripe (critique)
2. Webhooks (fondation)
3. Subscriptions CRUD
4. Factures
5. Crédits supplémentaires
6. Migration des existants 