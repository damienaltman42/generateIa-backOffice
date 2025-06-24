# Tâche 9 — Concevoir le schéma des tables

## Objectif
Définir la structure des tables nécessaires à la gestion des plans, abonnements, quotas, audit et RBAC dans la base de données.

## Étapes actionnables
- [ ] Lister les besoins métiers et les entités à modéliser (plans, subscriptions, quotas, audit, rôles).
- [ ] Définir les champs, types, relations et contraintes pour chaque table :
  - `plans` (id, nom, prix, limites, description)
  - `subscriptions` (id, userId, planId, stripeId, statut, période)
  - Compteurs de consommation dans `users` (articlesUsed, imagesUsed, socialPostsUsed, etc.)
  - `audit_logs` (id, userId, action, cible, date, meta)
  - (optionnel) `roles` et `user_roles` pour RBAC avancé
- [ ] Valider le schéma avec l'équipe technique et produit.
- [ ] Réaliser un diagramme visuel des relations (ex : dbdiagram.io).
- [ ] Documenter le schéma (description des champs, relations, contraintes).

## Critères d'acceptation
- Le schéma couvre tous les besoins métiers identifiés.
- Les relations et contraintes sont explicites et validées par l'équipe.
- Le diagramme et la documentation sont à jour.

## Points de vigilance
- Ne pas oublier les contraintes d'intégrité (foreign keys, unicité).
- Prévoir l'extensibilité pour de futurs besoins (nouveaux plans, rôles, quotas).

## Conseils
- Impliquer l'équipe produit pour valider les besoins et les cas d'usage.
- Utiliser un outil de modélisation visuelle pour faciliter la validation collective.

## Dépendances
- Aucun, cette tâche est le point de départ de l'Epic 2. 