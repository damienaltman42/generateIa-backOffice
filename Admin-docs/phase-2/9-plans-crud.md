# Tâche 9 — Développer le CRUD `/admin/plans` (création, édition, suppression, listing)

## Objectif
Permettre aux admins de gérer dynamiquement les plans d'abonnement (ajout, modification, suppression, listing) et d'y associer des quotas/limites.

## Étapes actionnables
- [ ] Définir la structure des plans (champs, quotas, limites, prix, description).
- [ ] Implémenter les endpoints CRUD (POST, GET, PATCH, DELETE) pour les plans.
- [ ] Gérer la validation des données (unicité, cohérence des quotas, etc.).
- [ ] Associer des quotas/limites à chaque plan (structure flexible).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à ces endpoints).
- [ ] Ajouter la documentation Swagger et des exemples de payloads/réponses.
- [ ] Tester les cas limites (plan existant, suppression d'un plan utilisé, etc.).

## Critères d'acceptation
- Les plans peuvent être créés, modifiés, supprimés et listés via l'API.
- Les quotas/limites sont bien associés à chaque plan.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Empêcher la suppression d'un plan utilisé par des utilisateurs actifs (ou prévoir une migration).
- Valider la cohérence des quotas/limites (pas de valeurs négatives, etc.).

## Conseils
- Prévoir une structure de quotas flexible (JSON, table dédiée).
- Notifier les utilisateurs en cas de changement de plan global.

## Dépendances
- La structure des plans doit être définie dans la BDD (phase 1). 