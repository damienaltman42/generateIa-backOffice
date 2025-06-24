# Phase 2 — Gestion des utilisateurs & abonnements du Backoffice Admin

## Objectif général
Permettre aux admins de gérer efficacement les utilisateurs, leurs droits, leur consommation, leurs abonnements et les plans/quotas associés.

---

## Epic 3 : API Admin Users

### Objectifs
- Offrir aux admins une interface complète pour la gestion des utilisateurs, de leurs droits, de leur consommation et de leur statut.
- Assurer la traçabilité et la sécurité de toutes les actions critiques sur les utilisateurs.

### Sous-tâches & Checklist

#### 1. Développer l'endpoint `/admin/users` (listing, pagination, filtres avancés)
- [ ] Permettre la recherche, le filtrage et la pagination des utilisateurs.
- [ ] Afficher les informations clés (statut, plan, consommation, date d'inscription, etc.).

#### 2. Endpoint `/admin/users/:id` (détail, consommation, historique)
- [ ] Afficher le détail d'un utilisateur, sa consommation, son historique d'actions.
- [ ] Permettre la visualisation de l'audit trail lié à cet utilisateur.

#### 3. Endpoint PATCH `/admin/users/:id` (modification droits, quotas, suspension, réinitialisation mot de passe)
- [ ] Modifier les droits (admin/user), quotas, statut (actif/suspendu).
- [ ] Réinitialiser le mot de passe d'un utilisateur.

#### 4. Endpoint POST `/admin/users/:id/reset-quotas` (remise à zéro manuelle)
- [ ] Permettre à l'admin de remettre à zéro la consommation d'un utilisateur.

#### 5. Endpoint pour supprimer un utilisateur (double confirmation, audit trail)
- [ ] Supprimer un utilisateur avec double confirmation et traçabilité dans l'audit trail.

#### 6. Intégrer l'audit trail sur toutes les actions admin
- [ ] Tracer toutes les actions critiques (modification droits, suppression, reset quotas, etc.).

#### 7. Ajouter des tests unitaires et E2E sur tous les endpoints
- [ ] Couvrir tous les cas d'usage (succès, erreurs, accès refusé, etc.).

#### 8. Documenter l'API (Swagger, README)
- [ ] Rédiger la documentation technique et fonctionnelle de l'API admin users.

---

### Livrables attendus
- API admin users complète, sécurisée, documentée.
- Audit trail opérationnel sur toutes les actions critiques.

---

### Critères de succès
- Toutes les actions sont tracées dans l'audit trail.
- Les quotas sont visibles et modifiables par l'admin.
- Les tests couvrent tous les cas d'usage et d'accès.

---

### Points de vigilance
- Protéger les actions critiques (suppression, modification droits).
- Vérifier la cohérence des quotas et des resets.
- S'assurer de la conformité RGPD (suppression, export, etc.).

---

### Conseils de mise en œuvre
- Impliquer l'équipe produit pour valider les besoins métiers (filtres, droits, quotas).
- Prévoir des endpoints robustes et bien documentés pour faciliter l'intégration frontend.
- Versionner la documentation de l'API.

---

## Epic 4 : Gestion des Plans & Quotas

### Objectifs
- Permettre la gestion dynamique des plans d'abonnement et des quotas associés, avec une logique de vérification et de reset automatique.

### Sous-tâches & Checklist

#### 1. Développer le CRUD `/admin/plans` (création, édition, suppression, listing)
- [ ] Permettre la gestion complète des plans (ajout, modification, suppression, listing).
- [ ] Associer des quotas et des limites à chaque plan.

#### 2. Endpoint `/admin/plans/:id` (détail, modification des limites)
- [ ] Afficher et modifier les limites/quotas d'un plan donné.

#### 3. Logique de vérification des quotas à chaque action utilisateur
- [ ] Vérifier les quotas à chaque génération d'article, image, post, etc.
- [ ] Bloquer ou alerter en cas de dépassement.

#### 4. Incrémentation automatique des compteurs de consommation
- [ ] Incrémenter les compteurs à chaque action utilisateur concernée.

#### 5. CRON job pour reset mensuel des compteurs
- [ ] Mettre en place un job automatique pour remettre à zéro les compteurs chaque mois.

#### 6. Endpoint pour override manuel d'un quota utilisateur
- [ ] Permettre à l'admin de modifier ponctuellement un quota utilisateur.

#### 7. Tests unitaires et E2E sur la gestion des quotas
- [ ] Couvrir tous les cas de dépassement, reset, override, etc.

#### 8. Documentation technique et fonctionnelle
- [ ] Rédiger la documentation sur la gestion des plans et quotas (README, Swagger, exemples d'usage).

---

### Livrables attendus
- API de gestion des plans et quotas opérationnelle.
- Documentation claire sur la logique de quotas et de reset.

---

### Critères de succès
- Les quotas sont respectés et bloquent la génération au-delà de la limite.
- Les resets mensuels fonctionnent automatiquement.
- Les tests couvrent tous les cas critiques.

---

### Points de vigilance
- Gérer les cas de dépassement de quota (alerte, blocage, logs).
- Synchroniser les quotas avec les changements de plan.
- S'assurer de la cohérence des quotas lors des migrations de plan.

---

### Conseils de mise en œuvre
- Impliquer l'équipe produit pour définir les limites et les règles de reset.
- Prévoir une interface d'administration claire pour la gestion des plans et quotas.
- Tester la logique de reset sur un environnement de staging avant la prod. 