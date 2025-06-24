# Tâche 10 — Endpoint `/admin/plans/:id` (détail, modification des limites)

## Objectif
Permettre à l'admin de consulter et de modifier les limites/quotas d'un plan donné.

## Étapes actionnables
- [ ] Définir les informations à afficher/modifier (quotas, limites, description, prix, etc.).
- [ ] Implémenter l'endpoint GET `/admin/plans/:id` (détail du plan).
- [ ] Implémenter l'endpoint PATCH `/admin/plans/:id` (modification des limites/quotas).
- [ ] Gérer la validation des modifications (cohérence, unicité, etc.).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à ces endpoints).
- [ ] Ajouter la documentation Swagger et des exemples de payloads/réponses.
- [ ] Tester les cas limites (plan inexistant, modification interdite, etc.).

## Critères d'acceptation
- L'admin peut consulter et modifier les limites/quotas d'un plan.
- Les modifications sont effectives et cohérentes.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger les modifications critiques (double confirmation si besoin).
- Valider la cohérence des quotas/limites après modification.

## Conseils
- Notifier les utilisateurs concernés en cas de modification majeure d'un plan.
- Prévoir un historique des modifications de plan (audit trail).

## Dépendances
- Le CRUD plans doit être en place (tâche 9). 