# Tâche 1 — Endpoint `/admin/jobs` (listing, filtres par statut, type, date)

## Objectif
Permettre aux admins de rechercher, filtrer et paginer efficacement la liste des jobs, avec accès aux informations clés (type, statut, date, user, durée, etc.).

## Étapes actionnables
- [ ] Définir les critères de recherche et de filtrage (statut, type, date, user, etc.).
- [ ] Implémenter la pagination (page, limit, total).
- [ ] Afficher les informations clés dans la réponse (type, statut, date, user, durée, etc.).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de réponse.
- [ ] Tester les cas limites (aucun résultat, page hors limite, filtres combinés).

## Critères d'acceptation
- L'endpoint retourne la liste paginée et filtrée des jobs.
- Les informations clés sont présentes et correctes.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Optimiser les requêtes pour éviter les lenteurs sur de gros volumes.
- Gérer les cas d'erreur (filtres invalides, page hors limite).

## Conseils
- Utiliser des index sur les champs fréquemment filtrés.
- Prévoir des tests de performance si le volume de jobs est important.

## Dépendances
- Le module admin et les guards doivent être en place (phase 1). 