# Tâche 2 — Endpoint `/admin/users/:id` (détail, consommation, historique)

## Objectif
Permettre à l'admin de consulter le détail d'un utilisateur, sa consommation et son historique d'actions.

## Étapes actionnables
- [ ] Définir les informations à afficher (profil, plan, quotas, consommation, statut, historique d'actions).
- [ ] Implémenter la récupération de la consommation (articles, images, posts, etc.).
- [ ] Afficher l'audit trail lié à l'utilisateur (actions, dates, admin ayant agi).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de réponse.
- [ ] Tester les cas limites (utilisateur inexistant, historique vide).

## Critères d'acceptation
- L'endpoint retourne toutes les informations détaillées attendues.
- L'audit trail est complet et lisible.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger les données sensibles (ne pas exposer le mot de passe, etc.).
- Optimiser la récupération de l'historique si volumineux.

## Conseils
- Paginer l'historique si besoin.
- Prévoir des filtres sur l'audit trail (type d'action, date).

## Dépendances
- L'endpoint listing doit être en place (tâche 1). 