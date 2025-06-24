# Phase 5 — Frontend Admin du Backoffice sowat.io

## Objectif général
Mettre en place une interface web admin moderne, sécurisée et ergonomique en React, permettant aux admins de piloter l'ensemble des fonctionnalités du backoffice.

---

## Epic 7 : Base Frontend Admin

### Objectifs
- Initialiser le projet frontend admin en React (via CLI, ex : create-react-app ou équivalent).
- Mettre en place l'authentification, la gestion des sessions et la sécurité d'accès admin.
- Créer le layout général (sidebar, header, navigation, responsive) et intégrer un design system.
- Offrir un dashboard principal avec KPIs et notifications globales.
- Garantir la maintenabilité, la documentation et la robustesse du socle frontend.

### Sous-tâches & Checklist

#### 1. Initialiser le projet React dans `/admin` (CLI)
- [ ] Créer le projet avec le CLI (create-react-app, Vite, Next.js, etc.).
- [ ] Configurer l'arborescence, le linting, le formatage, les scripts de build/test.

#### 2. Mettre en place l'authentification (login, JWT, gestion des sessions, redirection si non admin)
- [ ] Intégrer la logique d'authentification avec le backend (JWT, refresh, logout).
- [ ] Protéger toutes les routes admin (redirection si non admin ou non authentifié).
- [ ] Gérer le stockage sécurisé du token (httpOnly, XSS).

#### 3. Créer le layout général (sidebar, header, navigation, responsive)
- [ ] Concevoir une navigation claire et responsive.
- [ ] Intégrer un design system (UI kit, thèmes, accessibilité).

#### 4. Dashboard principal avec KPIs (utilisateurs actifs, jobs échoués, MRR, etc.)
- [ ] Afficher les indicateurs clés et les notifications globales.

#### 5. Gestion des erreurs et des notifications globales
- [ ] Centraliser la gestion des erreurs (API, UI) et des notifications (succès, échec, alertes).

#### 6. Documentation d'installation et de contribution frontend
- [ ] Rédiger un README détaillé pour l'installation, le développement, la contribution.

---

### Livrables attendus
- Base frontend admin fonctionnelle, sécurisée, documentée.
- Dashboard principal opérationnel.

---

### Critères de succès
- L'accès à l'admin est impossible sans authentification admin.
- Le design est cohérent, responsive et accessible.
- La documentation permet à un nouveau dev de contribuer facilement.

---

### Points de vigilance
- Sécuriser le stockage du token JWT (httpOnly, XSS).
- Gérer les cas de déconnexion automatique (session expirée).
- Prévoir l'accessibilité (a11y) et la compatibilité mobile.

---

### Conseils de mise en œuvre
- Utiliser un design system éprouvé (MUI, Ant Design, Chakra, etc.).
- Prévoir des hooks custom pour la gestion de l'authentification et des erreurs.
- Versionner la documentation et les scripts d'installation.

---

## Epic 8 : Pages principales du backoffice

### Objectifs
- Offrir toutes les fonctionnalités de gestion via l'UI admin (utilisateurs, plans, jobs, abonnements, audit, paramètres, etc.).
- Garantir la sécurité, la traçabilité et l'ergonomie sur toutes les pages critiques.

### Sous-tâches & Checklist

#### 1. Page liste utilisateurs (table, filtres, actions, export CSV)
- [ ] Afficher la liste paginée, filtrée, exportable des utilisateurs.
- [ ] Permettre les actions admin (modification, suppression, reset quotas, etc.).

#### 2. Page détail utilisateur (consommation, historique, abonnements, actions admin)
- [ ] Afficher le détail, la consommation, l'historique et les actions sur un utilisateur.

#### 3. Page gestion des plans (CRUD, quotas, affectation utilisateurs)
- [ ] Permettre la gestion complète des plans et quotas depuis l'UI.

#### 4. Page monitoring jobs (liste, relance, suppression, stats, logs)
- [ ] Offrir une supervision complète des jobs (listing, relance, suppression, stats, logs).

#### 5. Page gestion des abonnements Stripe (statut, factures, historique)
- [ ] Afficher et gérer les abonnements, factures, historiques de paiement.

#### 6. Page audit trail (recherche, filtres, export)
- [ ] Permettre la consultation, la recherche et l'export de l'audit trail.

#### 7. Page paramètres globaux (maintenance, messages, limites)
- [ ] Offrir une interface pour modifier les paramètres globaux de la plateforme.

#### 8. Intégration des notifications internes (UI, historique)
- [ ] Afficher et historiser les notifications internes pour les admins.

#### 9. Tests E2E sur les parcours critiques
- [ ] Écrire des tests E2E pour tous les parcours critiques (auth, actions admin, navigation, etc.).

---

### Livrables attendus
- UI admin complète, ergonomique, testée.
- Toutes les pages critiques sont sécurisées et traçables.

---

### Critères de succès
- Toutes les actions critiques sont accessibles et traçables depuis l'UI.
- Les exports/imports fonctionnent.
- Les tests couvrent tous les cas critiques.

---

### Points de vigilance
- Protéger les actions sensibles par double confirmation.
- Gérer les erreurs backend de façon claire côté UI.
- Prévoir la gestion des droits d'accès sur chaque page.

---

### Conseils de mise en œuvre
- Utiliser des composants réutilisables pour les tables, formulaires, modales.
- Prévoir une gestion centralisée des droits d'accès côté frontend.
- Tester l'UX sur différents profils d'admin et devices. 