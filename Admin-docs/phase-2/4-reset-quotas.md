# Tâche 4 — Endpoint POST `/admin/users/:id/reset-quotas` (remise à zéro manuelle)

## Objectif
Permettre à l'admin de remettre à zéro la consommation d'un utilisateur de façon sécurisée et traçable.

## Étapes actionnables
- [ ] Définir la logique de reset (quels compteurs, conditions, audit trail).
- [ ] Implémenter l'endpoint POST `/admin/users/:id/reset-quotas`.
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Tracer l'action dans l'audit trail (qui, quand, pourquoi).
- [ ] Ajouter la documentation Swagger et un exemple de payload/réponse.
- [ ] Tester les cas limites (utilisateur inexistant, reset interdit, etc.).

## Critères d'acceptation
- Le reset est effectif, sécurisé et tracé dans l'audit trail.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger l'action par une confirmation (éviter les erreurs).
- S'assurer que le reset ne supprime pas d'autres données utilisateur.

## Conseils
- Notifier l'utilisateur en cas de reset de ses quotas.
- Prévoir un log détaillé pour les audits futurs.

## Dépendances
- L'endpoint détail utilisateur doit être en place (tâche 2). 