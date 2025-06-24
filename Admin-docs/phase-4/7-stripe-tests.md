# Tâche 7 — Ajouter des tests unitaires et E2E sur la gestion des abonnements

## Objectif
Garantir la robustesse, la sécurité et la non-régression de la gestion des abonnements Stripe par des tests automatisés.

## Étapes actionnables
- [ ] Écrire des tests unitaires pour chaque cas de gestion des abonnements (création, modification, annulation, échec, désynchro).
- [ ] Écrire des tests E2E pour les parcours critiques (souscription, changement de plan, annulation, paiement, etc.).
- [ ] Automatiser l'exécution des tests dans la CI/CD.
- [ ] Documenter la stratégie de test et les cas couverts.

## Critères d'acceptation
- Tous les cas critiques sont couverts par des tests automatisés.
- Les tests échouent si une faille ou une régression est introduite.

## Points de vigilance
- Mettre à jour les tests à chaque évolution de la logique Stripe.
- S'assurer que les tests simulent bien des scénarios réels (paiement, annulation, désynchro).

## Conseils
- Utiliser des jeux de données variés pour simuler différents profils utilisateur et statuts d'abonnement.
- Intégrer les tests dans le pipeline CI/CD pour garantir la non-régression.

## Dépendances
- Les endpoints Stripe doivent être en place. 