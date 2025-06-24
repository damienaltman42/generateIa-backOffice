# Tâche 5 — Statistiques agrégées (taux d'échec, temps moyen, jobs en attente)

## Objectif
Fournir aux admins des statistiques globales et par type de job pour piloter la plateforme et détecter les incidents.

## Étapes actionnables
- [ ] Définir les indicateurs clés à calculer (taux d'échec, jobs en attente, temps moyen, etc.).
- [ ] Implémenter le calcul et l'exposition de ces statistiques via l'API.
- [ ] Afficher les tendances (évolution du taux d'échec, volume, etc.).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à ces endpoints).
- [ ] Ajouter la documentation Swagger et des exemples de réponses.
- [ ] Tester les cas limites (aucun job, volume important, etc.).

## Critères d'acceptation
- Les statistiques sont correctes, à jour et accessibles via l'API.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Optimiser les requêtes pour éviter les lenteurs sur de gros volumes.
- S'assurer de la cohérence des stats après suppression ou relance de jobs.

## Conseils
- Prévoir des graphiques ou exports pour faciliter l'analyse.
- Versionner la documentation des indicateurs.

## Dépendances
- Les endpoints jobs doivent être en place (tâche 1). 