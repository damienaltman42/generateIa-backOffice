# Tâche 3 — Créer un guard de rôle (`AdminGuard` ou `RolesGuard`) vérifiant `isAdmin`

## Objectif
Empêcher tout accès aux routes admin à un utilisateur qui n’a pas le rôle admin (`isAdmin !== true`).

## Étapes actionnables
- [ ] Définir un guard qui vérifie la propriété `isAdmin` sur l’utilisateur authentifié.
- [ ] Prévoir l’extension future pour d’autres rôles (RBAC).
- [ ] Ajouter des tests unitaires pour tous les cas (admin, non admin, non authentifié).
- [ ] Documenter la logique du guard dans le README du module admin.

## Critères d’acceptation
- Toute requête d’un utilisateur non admin est refusée sur `/admin/*`.
- Les tests couvrent tous les cas d’accès (admin, non admin, non authentifié).

## Points de vigilance
- S’assurer que la vérification du rôle est centralisée (éviter la duplication de logique).
- Prévoir la compatibilité avec un futur système de rôles multiples.

## Conseils
- Utiliser des mocks pour simuler différents profils utilisateur dans les tests.
- Discuter avec l’équipe produit des besoins futurs en matière de rôles.

## Dépendances
- Le guard JWT doit être en place (voir tâche 2). 