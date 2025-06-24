# Tâche 14 — Endpoint pour override manuel d'un quota utilisateur

## Objectif
Permettre à l'admin de modifier ponctuellement un quota utilisateur, de façon sécurisée et traçable.

## Étapes actionnables
- [ ] Définir les cas d'usage et les règles d'override (qui, quoi, quand, pourquoi).
- [ ] Implémenter l'endpoint PATCH `/admin/users/:id/override-quota`.
- [ ] Gérer la validation et la traçabilité de l'override (audit trail).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et des exemples de payloads/réponses.
- [ ] Tester les cas limites (utilisateur inexistant, quota déjà override, etc.).

## Critères d'acceptation
- L'override est effectif, sécurisé et tracé dans l'audit trail.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger l'action par une confirmation (éviter les abus).
- S'assurer de la cohérence des quotas après override.

## Conseils
- Notifier l'utilisateur en cas d'override de ses quotas.
- Prévoir un log détaillé pour les audits futurs.

## Dépendances
- Les compteurs de consommation et la logique de quotas doivent être en place (tâches 11 et 12). 