# Tâche 10 — Rédiger les migrations TypeORM correspondantes

## Objectif
Créer les scripts de migration pour mettre en place le schéma de BDD défini, en assurant la robustesse et la traçabilité des évolutions.

## Étapes actionnables
- [ ] Écrire les scripts de migration pour chaque table/modification définie dans le schéma.
- [ ] Ajouter les index, contraintes d'unicité, foreign keys, etc.
- [ ] Tester les migrations sur une base vierge (création complète).
- [ ] Tester les migrations sur une base existante (migration incrémentale).
- [ ] Documenter la procédure d'exécution et de rollback des migrations.

## Critères d'acceptation
- Les migrations s'exécutent sans erreur sur une base vierge et une base existante.
- Les contraintes et index sont bien créés.
- La procédure de rollback est documentée et testée.

## Points de vigilance
- Gérer les cas de migration de données existantes (backup, scripts de transformation).
- S'assurer de la compatibilité avec les environnements de staging et production.

## Conseils
- Versionner les scripts de migration.
- Automatiser les tests de migration dans la CI/CD.

## Dépendances
- Le schéma des tables doit être validé (voir tâche 9). 