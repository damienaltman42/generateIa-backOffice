# Tâche 7 — Ajouter des tests unitaires et E2E sur tous les endpoints

## Objectif
Garantir la robustesse, la sécurité et la non-régression de l'API admin users par des tests automatisés.

## Étapes actionnables
- [ ] Écrire des tests unitaires pour chaque endpoint (succès, erreurs, accès refusé).
- [ ] Écrire des tests E2E pour les parcours critiques (listing, modification, suppression, reset quotas, etc.).
- [ ] Automatiser l'exécution des tests dans la CI/CD.
- [ ] Documenter la stratégie de test et les cas couverts.

## Critères d'acceptation
- Tous les cas critiques sont couverts par des tests automatisés.
- Les tests échouent si une faille ou une régression est introduite.

## Points de vigilance
- Mettre à jour les tests à chaque évolution de l'API.
- S'assurer que les tests simulent bien des scénarios réels (profils, droits, erreurs).

## Conseils
- Utiliser des jeux de données variés pour simuler différents profils utilisateur.
- Intégrer les tests dans le pipeline CI/CD pour garantir la non-régression.

## Dépendances
- Les endpoints admin users doivent être en place. 