# Documentation Backoffice Admin sowat.io

## 1. Cartographie technique de l'existant

### A. Utilisateurs
- **Entité `User`** :  
  - Champs : `id`, `name`, `email`, `password`, `company`, `createdAt`, `updatedAt`, `isAdmin`
  - **Pas de quotas, ni d'abonnement, ni de consommation** (pas de champ pour nombre d'articles/images/posts générés, ni de lien vers un plan Stripe).
- **Service/Contrôleur** :  
  - CRUD très limité : création, recherche par email ou id, pas de listing, pas de pagination, pas de modification des droits, pas de suppression, pas de gestion de quotas.
  - Endpoint `/users/me` pour récupérer le profil courant (pas d'API admin).

### B. Articles
- **Entité `Article`** :  
  - Champs très complets (sujet, objectif, audience, ton, etc.), relations avec `User`, `GeneratedImageEntity`, `SocialMedia`.
  - Statut, progression, erreurs, suppression logique.
- **Service** :  
  - Création, listing, recherche par user, update, suppression, ajout d'images, progression.
  - **Pas de gestion de quotas** (aucune vérification du nombre d'articles générés par user).
  - **Pas de métriques de consommation** (pas de compteur d'articles générés par user).

### C. Images générées
- **Entité `GeneratedImageEntity`** :  
  - Champs : titre, alt, url, taille, extension, prompt, style, type (article/social), relations.
- **Service** :  
  - Création, listing, recherche, suppression, génération via script Python.
  - **Pas de gestion de quotas** (aucune vérification du nombre d'images générées par user).

### D. Réseaux sociaux
- **Entité `SocialMedia`** :  
  - Champs : description, type, postType, image, contenu, statut, erreur, etc.
  - Relation avec `Article` et `GeneratedImageEntity`.
- **Service** :  
  - Création, update, suppression, génération via script Python, gestion des jobs BullMQ.
  - **Pas de gestion de quotas** (aucune vérification du nombre de posts générés par user).

### E. Jobs & Monitoring
- **BullMQ** :  
  - Deux queues principales : `articleQueue` et `social-media-post`.
  - Dashboard Bull Board exposé sur `/jobs` (protégé par un middleware basique, mais pas de gestion fine des droits).
  - **Pas d'API pour relancer/supprimer un job échoué** (uniquement via l'UI Bull Board).
  - **Pas d'alerte automatique** en cas d'échec massif.

### F. Abonnement/Stripe
- **Aucune table, entité ou service lié à Stripe ou à la gestion d'abonnement**.
- **Aucun webhook Stripe**.
- **Aucun champ d'abonnement ou de plan dans User**.

### G. Sécurité & gestion des droits d'accès
- Authentification JWT pour les routes classiques.
- Middleware basique pour `/jobs` (login/pass en dur ou via env, pas de gestion RBAC).
- **Pas de routes séparées `/admin`** ni de guard de rôle admin.
- **Aucune gestion avancée des droits d'accès** :
  - Les simples utilisateurs pourraient accéder à des routes sensibles si elles existaient.
  - **Aucune vérification du rôle `isAdmin` sur les endpoints critiques**.
  - **Pas de séparation stricte entre les API utilisateur et les API admin**.

---

## 2. Ce qu'il manque pour le backoffice admin

### A. Gestion fine des utilisateurs
- Listing, recherche, pagination, filtrage (par plan, par consommation, par statut).
- Modification des droits (admin/user), quotas, suspension, suppression.
- Affichage de la consommation (articles/images/posts générés, quota restant, reset mensuel).
- Historique des actions (audit trail).

### B. Gestion des quotas et plans
- Table `plans` (nom, prix, limites JSON).
- Table `subscriptions` (userId, planId, stripeId, statut, période).
- Ajout de compteurs de consommation dans `User` ou table dédiée (articlesUsed, imagesUsed, socialPostsUsed, reset mensuel).
- Endpoints pour override ponctuel d'un quota.

### C. Abonnement Stripe
- Service Stripe (création de session, gestion des webhooks, mapping local).
- Table `subscriptions` liée à Stripe.
- Endpoints admin pour voir/modifier l'abonnement d'un user.

### D. Supervision des jobs
- API pour lister les jobs échoués, les relancer, les supprimer.
- Historique des erreurs (stacktrace, logs).
- Dashboard admin (statistiques, taux d'échec, etc.).

### E. Sécurité & conformité
- **Séparation stricte des routes `/admin/*`** :
  - Toutes les routes d'administration doivent être sous `/admin` et protégées par un guard spécifique.
  - **Seuls les utilisateurs avec `isAdmin=true` doivent pouvoir accéder à ces routes**.
  - Mise en place d'un `RolesGuard` ou équivalent pour vérifier le rôle à chaque requête admin.
- MFA pour les admins (optionnel).
- Audit trail.
- Limitation CORS à `admin.sowat.io`.
- **Aucune route admin ne doit être accessible à un utilisateur non admin**, même s'il est authentifié.

### F. Alertes & logs
- Centralisation des logs (Winston, S3, Graylog…).
- Notification Slack/Email en cas d'échec massif.

---

## 2bis. Gestion des droits d'accès et sécurité admin (section détaillée)

La sécurité d'accès au backoffice admin est un point critique. Il faut :

- **Séparer totalement les routes admin** (`/admin/*`) des routes utilisateur classique.
- **Mettre en place un guard de rôle** (ex : `RolesGuard`) qui vérifie systématiquement que l'utilisateur a bien `isAdmin=true` pour toute requête sur `/admin/*`.
- **Aucune route admin ne doit être accessible à un utilisateur non admin**, même s'il est authentifié.
- **Limiter l'accès CORS** du backoffice à `admin.sowat.io`.
- **Ajouter un audit trail** pour tracer toutes les actions critiques faites par un admin.
- **(Optionnel) Mettre en place une authentification forte (MFA)** pour les comptes admin.
- **Logger toutes les tentatives d'accès refusées** (pour monitoring et alertes).
- **Tester régulièrement** la robustesse de la séparation des droits (tests E2E, pentest interne).

---

## 3. Tâches à réaliser (roadmap technique)

### Modélisation BDD
- Créer tables `plans`, `subscriptions`, compteurs de consommation.
- Ajouter les migrations correspondantes.

### Développement NestJS
- Créer modules/services/controllers :
  - `admin` (listing users, gestion droits, quotas, consommation, audit)
  - `plans` (CRUD plans)
  - `subscriptions` (gestion Stripe, webhooks)
  - `jobs` (API relance/suppression jobs)
- **Ajouter les guards de rôle admin et la séparation stricte des routes**.
- **Vérifier systématiquement le rôle admin sur toutes les routes sensibles**.

### Gestion de la consommation
- Incrémenter les compteurs à chaque génération d'article/image/post.
- CRON mensuel pour reset et facturation des dépassements.

### Stripe
- Intégrer Stripe (clé secrète, webhooks, mapping plans).
- Endpoints pour gestion des abonnements.

### Monitoring & alertes
- Exposer API pour stats jobs, taux d'échec, logs.
- Intégrer alertes (Slack, email).

### Sécurité
- **Séparer les routes `/admin`**.
- **Ajouter MFA, audit trail, rate-limit, logs d'accès**.
- **Limiter CORS à l'admin**.

### Déploiement
- Ajouter service admin-back dans docker-compose.
- Variables d'environnement pour CORS, Stripe, etc.

---

## 4. Résumé des points critiques à ajouter

- **Aucune gestion de quotas ni d'abonnement n'est en place**.
- **Aucune API admin n'existe** (tout est orienté utilisateur final).
- **Pas de métriques de consommation**.
- **Pas d'API pour la gestion fine des jobs** (uniquement Bull Board UI).
- **Pas de sécurité avancée pour l'admin** :
  - Pas de guard de rôle admin
  - Pas de séparation stricte des routes
  - Pas de MFA
  - Pas d'audit trail
  - Les simples utilisateurs pourraient accéder à des routes critiques si elles existaient

---

## 5. Prochaines étapes recommandées

1. **Valider ce diagnostic**.
2. **Modéliser la BDD** (plans, subscriptions, compteurs).
3. **Développer les modules admin, plans, subscriptions, jobs**.
4. **Intégrer Stripe**.
5. **Mettre en place la sécurité avancée** (guards, MFA, audit, CORS, logs).
6. **Développer le front admin dans `/admin`**.
7. **Mettre en place des tests E2E pour la sécurité des accès admin**.

---

## 6. Fonctionnalités avancées et recommandations complémentaires

Pour garantir un backoffice admin robuste, sécurisé et évolutif, il est fortement recommandé d'intégrer les fonctionnalités suivantes :

### A. RBAC avancé (gestion fine des rôles et permissions)
- Permettre la création de plusieurs rôles (ex : superadmin, support, analyste) et d'attribuer des permissions granulaires par module ou action (lecture, écriture, suppression, accès facturation, etc.).
- Interface pour gérer dynamiquement les rôles et droits, utile si plusieurs équipes ou niveaux d'admin.

### B. Audit trail détaillé et consultable
- Historiser toutes les actions critiques (création/suppression/modification d'utilisateur, changement de droits, relance de jobs, etc.).
- Interface pour filtrer, rechercher et consulter les logs d'audit, stockage sécurisé pour conformité RGPD/SOC2.

### C. Gestion des sessions admin
- Afficher la liste des connexions actives (qui, où, quand), possibilité de forcer la déconnexion d'un admin.
- Expiration automatique des sessions après inactivité.

### D. Notifications internes
- Système de notifications pour les admins (ex : quota atteint, job failed, nouvel utilisateur, paiement échoué).
- Historique des notifications pour suivi et traçabilité.

### E. Gestion des API Keys
- Génération et gestion de clés API pour intégrations tierces ou usages internes.
- Permissions et quotas par clé, possibilité de révocation/rotation.

### F. Exports/imports de données
- Export CSV/Excel/PDF des utilisateurs, logs, consommation, etc.
- Import de données pour migration ou onboarding massif.

### G. Paramètres globaux modifiables
- Interface pour modifier des paramètres globaux (maintenance, messages système, limites par défaut, etc.).
- Historique des modifications de configuration.

### H. Module incidents/support
- Suivi des incidents (jobs échoués, erreurs critiques), création de tickets support, suivi des résolutions.
- Possibilité de laisser des commentaires internes sur un utilisateur ou un incident.

### I. Sécurité renforcée
- Double authentification (2FA/MFA) obligatoire pour les admins.
- Journalisation des accès refusés, alertes en temps réel, limitation géographique/IP, captcha sur le login admin.

### J. Expérience utilisateur admin (UX)
- Recherche globale (utilisateur, article, job, etc. depuis une seule barre).
- Tableaux de bord personnalisables (widgets, KPIs).
- Système d'aide/contextuel (tooltips, documentation intégrée).

---

*Ces fonctionnalités avancées permettent d'assurer la sécurité, la conformité, la productivité et la scalabilité du backoffice admin, en anticipant les besoins d'une plateforme SaaS moderne et professionnelle.*

---

*Si tu veux un plan d'implémentation détaillé pour chaque module, ou des exemples de code/migrations, demande-le !* 