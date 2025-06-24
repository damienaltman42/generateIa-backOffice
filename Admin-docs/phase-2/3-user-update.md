# Tâche 3 — Endpoint PATCH `/admin/users/:id` (modification droits, quotas, suspension, réinitialisation mot de passe)

## Objectif
Permettre à l'admin de modifier les droits, quotas, statut ou mot de passe d'un utilisateur de façon sécurisée et traçable.

## Étapes actionnables
- [ ] Définir les champs modifiables (isAdmin, quotas, statut, mot de passe).
- [ ] Implémenter la logique de modification sécurisée (validation, audit trail).
- [ ] Gérer la suspension/réactivation d'un utilisateur.
- [ ] Permettre la réinitialisation du mot de passe (génération, notification, sécurité).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de payload/réponse.
- [ ] Tester les cas limites (utilisateur inexistant, modification interdite, etc.).

## Critères d'acceptation
- Les modifications sont effectives, sécurisées et tracées dans l'audit trail.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger les actions critiques (double confirmation, logs).
- Valider les entrées pour éviter les erreurs ou abus.

## Conseils
- Notifier l'utilisateur en cas de modification de ses droits ou mot de passe.
- Prévoir une politique de mot de passe robuste.

## Dépendances
- L'endpoint détail utilisateur doit être en place (tâche 2). 