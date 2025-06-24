# Phase 1 — Fondations & Sécurité du Backoffice Admin

## Objectif général
Mettre en place l'architecture sécurisée du backoffice admin, garantir la séparation stricte des accès, et poser les bases pour la suite du projet.

---

## Epic 1 : Architecture & Sécurité Admin

### Objectifs
- Séparer strictement les routes admin (`/admin/*`) des routes utilisateur.
- Garantir que seuls les admins accèdent au backoffice.
- Préparer la base pour un RBAC évolutif.

### Sous-tâches & Checklist

#### 1. Définir la structure des modules backend
- [ ] Créer un module `admin` dédié dans le backend.
- [ ] Organiser les contrôleurs, services et routes spécifiques à l'admin.
- [ ] Préparer un dossier pour les guards et décorateurs liés à l'admin.

#### 2. Mettre en place un guard d'authentification JWT pour toutes les routes admin
- [ ] Vérifier que le guard JWT est bien appliqué à toutes les routes `/admin/*`.
- [ ] Tester l'accès sans token, avec token invalide, avec token expiré.

#### 3. Créer un guard de rôle (`AdminGuard` ou `RolesGuard`) vérifiant `isAdmin`
- [ ] Définir un guard qui bloque l'accès à toute route admin si `user.isAdmin !== true`.
- [ ] Prévoir l'extension future pour d'autres rôles (RBAC).
- [ ] Ajouter des tests unitaires sur ce guard.

#### 4. Appliquer ce guard à toutes les routes `/admin/*`
- [ ] Protéger tous les contrôleurs et endpoints admin avec le guard de rôle.
- [ ] Vérifier qu'aucune route admin n'est accessible à un utilisateur non admin.

#### 5. Configurer CORS pour n'autoriser que `admin.sowat.io`
- [ ] Restreindre les origines autorisées pour l'admin dans la config CORS.
- [ ] Tester l'accès depuis d'autres domaines (doit être refusé).

#### 6. Définir le décorateur `@Roles()` pour une gestion future de RBAC avancé
- [ ] Créer un décorateur `@Roles()` utilisable sur les routes ou contrôleurs.
- [ ] Documenter son usage pour les futures évolutions.

#### 7. Rédiger des tests unitaires et E2E pour la sécurité d'accès admin
- [ ] Écrire des tests pour tous les cas d'accès (admin, non admin, non authentifié).
- [ ] Couvrir les cas de bypass potentiels (token forgé, manipulation JWT, etc.).

#### 8. Documenter la politique de sécurité (README technique)
- [ ] Rédiger une documentation claire sur la séparation des accès, la logique des guards, et la configuration CORS.
- [ ] Expliquer comment ajouter de nouveaux rôles ou permissions à l'avenir.

---

### Livrables attendus
- Module admin sécurisé, non accessible aux non-admins.
- Guards d'authentification et de rôle opérationnels.
- Décorateur `@Roles()` prêt pour le RBAC.
- Tests unitaires et E2E couvrant tous les cas critiques.
- Documentation technique à jour.

---

### Critères de succès
- Aucun utilisateur non admin ne peut accéder à une route admin, même authentifié.
- Les tests E2E couvrent tous les cas d'accès refusé/autorisé.
- La configuration CORS est stricte et testée.
- La documentation permet à un nouveau dev de comprendre et d'étendre la sécurité admin.

---

### Points de vigilance
- Tester les bypass potentiels (token forgé, manipulation JWT, etc.).
- Vérifier la configuration CORS sur tous les environnements (dev, staging, prod).
- S'assurer que la logique de guard est centralisée et non dupliquée.
- Prévoir l'extension future vers un RBAC plus fin (plusieurs rôles, permissions).
- Garder la documentation à jour à chaque évolution de la sécurité.

---

## Conseils de mise en œuvre
- Impliquer un dev senior pour la revue de la sécurité.
- Utiliser des outils d'audit de sécurité (linters, scanners JWT, etc.).
- Prévoir une session de tests croisés (pair testing) sur les accès admin.
- Documenter chaque décision d'architecture ou de sécurité dans le README technique.

---

*Cette phase est la fondation de toute la sécurité du backoffice. Sa robustesse conditionne la suite du projet.*

---

## Epic 2 : Modélisation BDD & Migrations

### Objectifs
- Préparer la base de données pour supporter la gestion des plans, abonnements, quotas, audit et RBAC.

### Sous-tâches & Checklist

#### 1. Concevoir le schéma des tables
- [ ] Définir la structure des tables suivantes :
  - `plans` (id, nom, prix, limites, description)
  - `subscriptions` (id, userId, planId, stripeId, statut, période)
  - Ajout de compteurs de consommation dans `users` (articlesUsed, imagesUsed, socialPostsUsed, etc.)
  - `audit_logs` (id, userId, action, cible, date, meta)
  - (optionnel) `roles` et `user_roles` pour RBAC avancé
- [ ] Valider le schéma avec l'équipe technique et produit.
- [ ] Documenter le schéma (diagramme, description des champs, relations).

#### 2. Rédiger les migrations TypeORM correspondantes
- [ ] Écrire les scripts de migration pour chaque table/modification.
- [ ] Prévoir les index et contraintes nécessaires (unicité, foreign keys, etc.).
- [ ] Tester les migrations sur une base vierge et sur une base existante (si applicable).

#### 3. Mettre à jour les entités TypeORM
- [ ] Aligner les entités TypeORM sur le schéma réel (attributs, relations, validations).
- [ ] Ajouter les décorateurs nécessaires pour la gestion des relations et des contraintes.

#### 4. Écrire des scripts de seed pour les plans de base
- [ ] Créer des scripts pour insérer les plans par défaut (Free, Pro, Agency, etc.).
- [ ] Documenter comment exécuter et maintenir ces scripts.

#### 5. Documenter le schéma BDD
- [ ] Rédiger un README ou une section dédiée à la BDD (diagramme, explications, exemples d'utilisation).
- [ ] Mettre à jour la documentation à chaque évolution du schéma.

---

### Livrables attendus
- Migrations prêtes et testées.
- Entités TypeORM à jour.
- Scripts de seed pour les plans de base.
- Documentation du schéma BDD (diagramme, README).

---

### Critères de succès
- Les migrations s'exécutent sans erreur sur une base vierge.
- Les entités sont alignées avec le schéma réel.
- Les scripts de seed fonctionnent et insèrent les plans attendus.
- La documentation permet de comprendre et d'exploiter la BDD facilement.

---

### Points de vigilance
- Prévoir la migration des données existantes si besoin (stratégie de migration, backup).
- Gérer la rétrocompatibilité avec les anciennes entités et données.
- Vérifier la cohérence des relations et des contraintes (foreign keys, index).
- S'assurer que les scripts de seed sont idempotents (pas de doublons).

---

### Conseils de mise en œuvre
- Utiliser un outil de modélisation visuelle pour valider le schéma (ex : dbdiagram.io).
- Impliquer l'équipe produit pour valider les besoins métiers (quotas, statuts, etc.).
- Versionner les scripts de migration et de seed.
- Tester les migrations sur un environnement de staging avant la prod.
- Documenter chaque modification du schéma dans un changelog BDD. 