# Tâche 6 — Définir le décorateur `@Roles()` pour le RBAC avancé

## Objectif
Préparer la base pour une gestion fine des rôles et permissions via un décorateur réutilisable.

## Étapes actionnables
- [ ] Créer un décorateur `@Roles()` utilisable sur les routes ou contrôleurs.
- [ ] Prévoir la compatibilité avec plusieurs rôles et permissions.
- [ ] Documenter l’utilisation du décorateur dans le README admin.
- [ ] Ajouter des exemples d’utilisation pour les futures évolutions.

## Critères d’acceptation
- Le décorateur est utilisable sur n’importe quelle route ou contrôleur.
- La documentation explique clairement son usage et ses possibilités d’extension.

## Points de vigilance
- Garder le décorateur simple et générique pour faciliter l’évolution.
- S’assurer de la cohérence avec le guard de rôle existant.

## Conseils
- S’inspirer des patterns NestJS pour les décorateurs custom.
- Anticiper les besoins futurs en matière de RBAC (plusieurs rôles, permissions).

## Dépendances
- Le guard de rôle doit être en place (voir tâche 3). 