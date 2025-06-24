# Plan détaillé de réalisation du Backoffice Admin sowat.io

Ce plan est conçu pour garantir une implémentation exhaustive, sécurisée et scalable du backoffice admin, en suivant les meilleures pratiques SaaS et les besoins spécifiques de sowat.io.

---

## **Phase 1 : Fondations & Sécurité**

### **Epic 1 : Architecture & Sécurité Admin**
**Objectifs :**
- Séparer strictement les routes admin (`/admin/*`) des routes utilisateur.
- Garantir que seuls les admins accèdent au backoffice.

**Sous-tâches :**
1. Définir la structure des modules backend (création d'un module `admin`).
2. Mettre en place un guard d'authentification JWT pour toutes les routes admin.
3. Créer un guard de rôle (`AdminGuard` ou `RolesGuard`) vérifiant `isAdmin`.
4. Appliquer ce guard à toutes les routes `/admin/*` (contrôleurs, modules, routes).
5. Configurer CORS pour n'autoriser que `admin.sowat.io`.
6. Définir le décorateur `@Roles()` pour une gestion future de RBAC avancé.
7. Rédiger des tests unitaires et E2E pour la sécurité d'accès admin.
8. Documenter la politique de sécurité (README technique).

**Livrables :**
- Module admin sécurisé, non accessible aux non-admins.
- Documentation claire sur la séparation des accès.

**Critères de succès :**
- Aucun utilisateur non admin ne peut accéder à une route admin, même authentifié.
- Les tests E2E couvrent tous les cas d'accès refusé/autorisé.

**Points de vigilance :**
- Tester les bypass potentiels (token forgé, manipulation JWT, etc.).
- Vérifier la configuration CORS sur tous les environnements.

---

### **Epic 2 : Modélisation BDD & Migrations**
**Objectifs :**
- Préparer la base de données pour supporter la gestion des plans, abonnements, quotas, audit et RBAC.

**Sous-tâches :**
1. Concevoir le schéma des tables :
   - `plans` (id, nom, prix, limites, description)
   - `subscriptions` (id, userId, planId, stripeId, statut, période)
   - Ajout de compteurs de consommation dans `users` (articlesUsed, imagesUsed, socialPostsUsed, etc.)
   - `audit_logs` (id, userId, action, cible, date, meta)
   - (optionnel) `roles` et `user_roles` pour RBAC avancé
2. Rédiger les migrations TypeORM correspondantes.
3. Mettre à jour les entités TypeORM.
4. Écrire des scripts de seed pour les plans de base (Free, Pro, Agency).
5. Documenter le schéma BDD (diagramme, README).

**Livrables :**
- Migrations prêtes et testées.
- Documentation du schéma BDD.

**Critères de succès :**
- Les migrations s'exécutent sans erreur sur une base vierge.
- Les entités sont alignées avec le schéma réel.

**Points de vigilance :**
- Prévoir la migration des données existantes si besoin.
- Gérer la rétrocompatibilité avec les anciennes entités.

---

## **Phase 2 : Gestion des utilisateurs & abonnements**

### **Epic 3 : API Admin Users**
**Objectifs :**
- Permettre aux admins de gérer tous les utilisateurs, leurs droits, leur consommation et leur statut.

**Sous-tâches :**
1. Développer l'endpoint `/admin/users` (listing, pagination, filtres avancés).
2. Endpoint `/admin/users/:id` (détail, consommation, historique).
3. Endpoint PATCH `/admin/users/:id` (modification droits, quotas, suspension, réinitialisation mot de passe).
4. Endpoint POST `/admin/users/:id/reset-quotas` (remise à zéro manuelle).
5. Endpoint pour supprimer un utilisateur (double confirmation, audit trail).
6. Intégrer l'audit trail sur toutes les actions admin.
7. Ajouter des tests unitaires et E2E sur tous les endpoints.
8. Documenter l'API (Swagger, README).

**Livrables :**
- API admin users complète, sécurisée, documentée.
- Audit trail opérationnel.

**Critères de succès :**
- Toutes les actions sont tracées dans l'audit trail.
- Les quotas sont visibles et modifiables par l'admin.
- Les tests couvrent tous les cas d'usage.

**Points de vigilance :**
- Protéger les actions critiques (suppression, modification droits).
- Vérifier la cohérence des quotas et des resets.

---

### **Epic 4 : Gestion des Plans & Quotas**
**Objectifs :**
- Permettre la gestion dynamique des plans d'abonnement et des quotas associés.

**Sous-tâches :**
1. Développer le CRUD `/admin/plans` (création, édition, suppression, listing).
2. Endpoint `/admin/plans/:id` (détail, modification des limites).
3. Logique de vérification des quotas à chaque action utilisateur (article, image, post).
4. Incrémentation automatique des compteurs de consommation.
5. CRON job pour reset mensuel des compteurs.
6. Endpoint pour override manuel d'un quota utilisateur.
7. Tests unitaires et E2E sur la gestion des quotas.
8. Documentation technique et fonctionnelle.

**Livrables :**
- API de gestion des plans et quotas opérationnelle.
- Documentation claire sur la logique de quotas.

**Critères de succès :**
- Les quotas sont respectés et bloquent la génération au-delà de la limite.
- Les resets mensuels fonctionnent automatiquement.

**Points de vigilance :**
- Gérer les cas de dépassement de quota (alerte, blocage, logs).
- Synchroniser les quotas avec les changements de plan.

---

## **Phase 3 : Monitoring & Jobs**

### **Epic 5 : API Jobs Management**
**Objectifs :**
- Offrir aux admins une supervision complète des jobs (génération, publication, etc.) et la possibilité de relancer ou supprimer les jobs échoués.

**Sous-tâches :**
1. Endpoint `/admin/jobs` (listing, filtres par statut, type, date).
2. Endpoint `/admin/jobs/failed` (liste des jobs échoués, détails, stacktrace).
3. Endpoint POST `/admin/jobs/:id/retry` (relancer un job échoué).
4. Endpoint DELETE `/admin/jobs/:id` (suppression/purge d'un job).
5. Statistiques agrégées (taux d'échec, temps moyen, jobs en attente).
6. Webhook/alerte automatique si taux d'échec > seuil.
7. Historique des actions sur les jobs (audit trail).
8. Tests unitaires et E2E sur la gestion des jobs.
9. Documentation API et monitoring.

**Livrables :**
- API de monitoring des jobs complète et sécurisée.
- Dashboard admin (statistiques, alertes).

**Critères de succès :**
- Les admins peuvent relancer/supprimer n'importe quel job échoué.
- Les alertes sont envoyées en cas d'incident massif.

**Points de vigilance :**
- Protéger les endpoints critiques (relance/suppression massive).
- S'assurer de la cohérence des stats et de l'audit trail.

---

## **Phase 4 : Intégration Stripe & Billing**

### **Epic 6 : Stripe & Gestion des abonnements**
**Objectifs :**
- Permettre la gestion complète des abonnements utilisateurs via Stripe, synchroniser les statuts et gérer la facturation.

**Sous-tâches :**
1. Intégrer le SDK Stripe côté backend (configuration, clés, sécurité).
2. Créer les endpoints `/admin/subscriptions` (listing, détail, modification, annulation).
3. Implémenter les webhooks Stripe (paiement réussi, échec, changement de plan, annulation, etc.).
4. Synchroniser le statut d'abonnement Stripe avec la BDD locale (`subscriptions`).
5. Gérer la création et la modification des plans Stripe depuis l'admin (optionnel).
6. Générer et stocker les factures, reçus, historiques de paiement.
7. Ajouter des tests unitaires et E2E sur la gestion des abonnements.
8. Documenter la gestion Stripe (README, Swagger).

**Livrables :**
- API d'abonnement Stripe complète et sécurisée.
- Webhooks opérationnels et documentés.

**Critères de succès :**
- Les changements d'abonnement Stripe sont reflétés en temps réel côté admin.
- Les factures et statuts sont accessibles et fiables.

**Points de vigilance :**
- Sécuriser les webhooks Stripe (signature, idempotence).
- Gérer les cas de désynchronisation (ex : paiement échoué non reçu).

---

## **Phase 5 : Frontend Admin**

### **Epic 7 : Base Frontend Admin**
**Objectifs :**
- Mettre en place l'interface web du backoffice admin, sécurisée et ergonomique.

**Sous-tâches :**
1. Initialiser le projet frontend dans `/admin` (React, Next.js ou équivalent).
2. Mettre en place l'authentification (login, JWT, gestion des sessions, redirection si non admin).
3. Créer le layout général (sidebar, header, navigation, responsive).
4. Intégrer un design system (UI kit, thèmes, accessibilité).
5. Dashboard principal avec KPIs (utilisateurs actifs, jobs échoués, MRR, etc.).
6. Gestion des erreurs et des notifications globales.
7. Documentation d'installation et de contribution frontend.

**Livrables :**
- Base frontend admin fonctionnelle et sécurisée.
- Dashboard principal opérationnel.

**Critères de succès :**
- L'accès à l'admin est impossible sans authentification admin.
- Le design est cohérent et responsive.

**Points de vigilance :**
- Sécuriser le stockage du token JWT (httpOnly, XSS).
- Gérer les cas de déconnexion automatique (session expirée).

---

### **Epic 8 : Pages principales du backoffice**
**Objectifs :**
- Offrir toutes les fonctionnalités de gestion via l'UI admin.

**Sous-tâches :**
1. Page liste utilisateurs (table, filtres, actions, export CSV).
2. Page détail utilisateur (consommation, historique, abonnements, actions admin).
3. Page gestion des plans (CRUD, quotas, affectation utilisateurs).
4. Page monitoring jobs (liste, relance, suppression, stats, logs).
5. Page gestion des abonnements Stripe (statut, factures, historique).
6. Page audit trail (recherche, filtres, export).
7. Page paramètres globaux (maintenance, messages, limites).
8. Intégration des notifications internes (UI, historique).
9. Tests E2E sur les parcours critiques.

**Livrables :**
- UI admin complète, ergonomique, testée.

**Critères de succès :**
- Toutes les actions critiques sont accessibles et traçables depuis l'UI.
- Les exports/imports fonctionnent.

**Points de vigilance :**
- Protéger les actions sensibles par double confirmation.
- Gérer les erreurs backend de façon claire côté UI.

---

## **Phase 6 : Sécurité avancée & conformité**

### **Epic 9 : Sécurité avancée & conformité**
**Objectifs :**
- Renforcer la sécurité du backoffice et garantir la conformité RGPD/SOC2.

**Sous-tâches :**
1. Implémenter la double authentification (2FA/MFA) pour les admins.
2. Limiter l'accès admin par IP ou géolocalisation (optionnel).
3. Ajouter un captcha sur le login admin.
4. Logger toutes les tentatives d'accès refusées et alertes en temps réel.
5. Mettre en place la gestion des sessions (liste, expiration, force logout).
6. S'assurer de la traçabilité complète (audit trail, logs d'accès, logs d'actions).
7. Mettre à jour la politique de confidentialité et la documentation RGPD.
8. Tests de sécurité (pentest interne, tests E2E).

**Livrables :**
- Sécurité renforcée sur tous les accès admin.
- Documentation conformité à jour.

**Critères de succès :**
- Aucun accès non autorisé possible même en cas de faille sur un endpoint.
- Les logs et audits sont exploitables et complets.

**Points de vigilance :**
- Tester la robustesse de la 2FA/MFA.
- S'assurer de la conformité légale (droit à l'oubli, export, etc.).

---

## **Phase 7 : Fonctionnalités avancées**

### **Epic 10 : RBAC avancé & gestion des permissions**
**Objectifs :**
- Permettre une gestion fine des rôles et des droits d'accès.

**Sous-tâches :**
1. Concevoir le modèle de rôles (superadmin, support, analyste, etc.).
2. Implémenter la gestion dynamique des rôles et permissions (backend + UI).
3. Appliquer les permissions à tous les modules critiques.
4. Tests unitaires et E2E sur la gestion des rôles.
5. Documentation d'utilisation et de gestion des rôles.

**Livrables :**
- RBAC opérationnel et flexible.

**Critères de succès :**
- Les permissions sont respectées sur tous les modules.

**Points de vigilance :**
- Éviter les escalades de privilèges.

---

### **Epic 11 : Notifications, API Keys, Exports, Incidents**
**Objectifs :**
- Ajouter les features avancées pour la productivité et la scalabilité.

**Sous-tâches :**
1. Implémenter le système de notifications internes (backend + UI).
2. Gestion des API Keys (création, révocation, permissions, quotas).
3. Exports/imports de données (CSV, Excel, PDF, import utilisateurs).
4. Module incidents/support (création, suivi, commentaires internes).
5. Page et API paramètres globaux (maintenance, messages, limites).
6. Recherche globale (backend + UI).
7. Tableaux de bord personnalisables (widgets, KPIs).
8. Documentation utilisateur et technique.

**Livrables :**
- Features avancées en production.

**Critères de succès :**
- Les admins disposent de tous les outils pour piloter la plateforme.

**Points de vigilance :**
- Sécuriser l'accès aux API Keys et aux exports.
- Gérer la volumétrie des exports/imports.

---

## **Phase 8 : Finalisation, tests & déploiement**

### **Epic 12 : Tests, QA & Déploiement**
**Objectifs :**
- Garantir la qualité, la stabilité et la maintenabilité du backoffice admin.

**Sous-tâches :**
1. Rédiger et automatiser les tests E2E sur tous les parcours critiques.
2. Effectuer des tests de charge et de montée en charge (scalabilité).
3. Revue de code croisée et validation sécurité.
4. Finaliser la documentation technique et utilisateur.
5. Préparer les scripts de déploiement (Docker, CI/CD, migrations auto).
6. Déployer sur l'environnement de production (`admin.sowat.io`).
7. Mettre en place le monitoring post-prod (alertes, logs, uptime).
8. Organiser une phase de recette avec les admins clés.

**Livrables :**
- Backoffice admin en production, stable et documenté.

**Critères de succès :**
- Aucun bug bloquant ou faille critique en production.
- Les admins sont autonomes et satisfaits de l'outil.

**Points de vigilance :**
- Tester la restauration après incident (backup, rollback).
- S'assurer de la maintenabilité (tests, doc, CI/CD).

---

*Ce plan peut être adapté selon les priorités business, la taille de l'équipe et les retours utilisateurs. Il garantit une montée en puissance progressive, sécurisée et conforme aux standards SaaS.*

**Veux-tu que je poursuive avec la suite du plan ?** 