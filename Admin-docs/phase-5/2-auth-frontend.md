# Tâche 2 — Mettre en place l’authentification (login, JWT, gestion des sessions, redirection si non admin)

## Objectif
Sécuriser l’accès au backoffice admin en React, en intégrant une authentification robuste et une gestion des sessions adaptée aux besoins admin.

## Étapes actionnables
- [ ] Créer la page de login et la logique d’appel à l’API backend (JWT).
- [ ] Stocker le token de façon sécurisée (httpOnly, XSS).
- [ ] Gérer le refresh token et la déconnexion (logout).
- [ ] Protéger toutes les routes admin (redirection si non admin ou non authentifié).
- [ ] Gérer la redirection automatique après login/logout.
- [ ] Tester les cas limites (token expiré, suppression admin, etc.).

## Critères d’acceptation
- L’accès à l’admin est impossible sans authentification admin.
- Les tokens sont stockés de façon sécurisée.
- Les tests couvrent tous les cas d’accès (valide, invalide, expiré, non admin).

## Points de vigilance
- Ne jamais exposer le token dans le JS global ou le localStorage.
- Gérer la révocation des droits admin en temps réel.

## Conseils
- Utiliser des hooks custom pour la gestion de l’authentification.
- Prévoir une UX claire pour les erreurs d’authentification.

## Dépendances
- Le backend doit exposer les endpoints d’authentification (phase 1). 