# Tâche 2 — Endpoint `/admin/jobs/failed` (liste des jobs échoués, détails, stacktrace)

## Objectif
Permettre aux admins de lister, filtrer et consulter le détail des jobs échoués, avec accès à l'erreur et au stacktrace.

## Étapes actionnables
- [ ] Définir les informations à afficher (type, date, user, message d'erreur, stacktrace, etc.).
- [ ] Implémenter la recherche et le filtrage (type, date, user, message d'erreur).
- [ ] Afficher le détail complet d'un job échoué (erreur, stacktrace, contexte).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de réponse.
- [ ] Tester les cas limites (aucun job échoué, stacktrace volumineux).

## Critères d'acceptation
- L'endpoint retourne la liste filtrée des jobs échoués avec tous les détails attendus.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger l'accès aux informations sensibles dans les erreurs/stacktraces.
- Optimiser la récupération des logs volumineux.

## Conseils
- Prévoir une pagination et des filtres avancés pour les jobs échoués.
- Masquer ou anonymiser les données sensibles dans les logs d'erreur.

## Dépendances
- L'endpoint listing jobs doit être en place (tâche 1). 