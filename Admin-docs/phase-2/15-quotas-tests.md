# Tâche 15 — Tests unitaires et E2E sur la gestion des quotas

## Objectif
Garantir la robustesse, la sécurité et la non-régression de la gestion des quotas par des tests automatisés.

## Étapes actionnables
- [ ] Écrire des tests unitaires pour chaque cas de gestion des quotas (dépassement, reset, override, etc.).
- [ ] Écrire des tests E2E pour les parcours critiques (création plan, changement de plan, reset, override, etc.).
- [ ] Automatiser l'exécution des tests dans la CI/CD.
- [ ] Documenter la stratégie de test et les cas couverts.

## Critères d'acceptation
- Tous les cas critiques sont couverts par des tests automatisés.
- Les tests échouent si une faille ou une régression est introduite.

## Points de vigilance
- Mettre à jour les tests à chaque évolution de la logique de quotas.
- S'assurer que les tests simulent bien des scénarios réels (changements de plan, quotas multiples).

## Conseils
- Utiliser des jeux de données variés pour simuler différents profils utilisateur et plans.
- Intégrer les tests dans le pipeline CI/CD pour garantir la non-régression.

## Dépendances
- La logique de quotas et les endpoints doivent être en place. 