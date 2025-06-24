# Tâche 7 — Rédiger des tests unitaires et E2E pour la sécurité d’accès admin

## Objectif
Garantir par des tests automatisés que la sécurité d’accès admin est robuste et non contournable.

## Étapes actionnables
- [ ] Écrire des tests unitaires pour les guards (JWT, rôle admin).
- [ ] Écrire des tests E2E pour tous les cas d’accès (admin, non admin, non authentifié).
- [ ] Couvrir les cas de bypass potentiels (token forgé, manipulation JWT, etc.).
- [ ] Automatiser l’exécution des tests dans la CI/CD.
- [ ] Documenter la stratégie de test dans le README technique.

## Critères d’acceptation
- Tous les cas critiques d’accès sont couverts par des tests automatisés.
- Les tests échouent si une faille d’accès est introduite.

## Points de vigilance
- Mettre à jour les tests à chaque évolution des guards ou des routes admin.
- S’assurer que les tests E2E simulent bien des scénarios réels (tokens, headers, etc.).

## Conseils
- Utiliser des jeux de données variés pour simuler différents profils utilisateur.
- Intégrer les tests dans le pipeline CI/CD pour garantir la non-régression.

## Dépendances
- Les guards et la structure des modules admin doivent être en place. 