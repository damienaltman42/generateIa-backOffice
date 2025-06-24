# Tâche 4 — Endpoint DELETE `/admin/jobs/:id` (suppression/purge d'un job)

## Objectif
Permettre à l'admin de supprimer ou purger un job (échoué, terminé, en attente) de façon sécurisée et traçable.

## Étapes actionnables
- [ ] Définir la logique de suppression/purge (conditions, limitations, audit trail).
- [ ] Implémenter l'endpoint DELETE `/admin/jobs/:id`.
- [ ] Protéger l'action par une confirmation et tracer dans l'audit trail.
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de payload/réponse.
- [ ] Tester les cas limites (job inexistant, suppression interdite, etc.).

## Critères d'acceptation
- La suppression/purge est effective, sécurisée et tracée dans l'audit trail.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger l'action contre les suppressions massives accidentelles.
- S'assurer de la cohérence des stats après suppression.

## Conseils
- Notifier l'admin en cas de suppression d'un job critique.
- Prévoir un log détaillé pour les audits futurs.

## Dépendances
- L'endpoint jobs failed doit être en place (tâche 2). 