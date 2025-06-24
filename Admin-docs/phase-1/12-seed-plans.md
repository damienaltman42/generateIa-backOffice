# Tâche 12 — Écrire des scripts de seed pour les plans de base

## Objectif
Permettre l'initialisation rapide de la BDD avec les plans d'abonnement de base (Free, Pro, Agency, etc.) pour faciliter le développement, les tests et la production.

## Étapes actionnables
- [ ] Définir la liste des plans de base à créer (noms, limites, prix, description).
- [ ] Écrire les scripts de seed pour insérer ces plans dans la BDD.
- [ ] Tester l'exécution des scripts sur une base vierge et existante.
- [ ] Documenter la procédure d'exécution et de maintenance des scripts de seed.

## Critères d'acceptation
- Les plans de base sont présents dans la BDD après exécution du seed.
- Les scripts sont idempotents (pas de doublons si relancés).
- La documentation est claire et à jour.

## Points de vigilance
- S'assurer que les scripts de seed ne suppriment pas de données existantes.
- Prévoir la possibilité d'ajouter/modifier des plans ultérieurement.

## Conseils
- Versionner les scripts de seed.
- Tester les scripts sur différents environnements (dev, staging, prod).

## Dépendances
- Les entités et migrations doivent être prêtes (voir tâches 10 et 11). 