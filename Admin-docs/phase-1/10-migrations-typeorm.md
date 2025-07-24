# Tâche 10 — Rédiger les migrations TypeORM correspondantes

## Objectif
Créer les scripts de migration pour mettre en place le schéma de BDD défini, en assurant la robustesse et la traçabilité des évolutions.

## Étapes actionnables
- [ ] Creer les entities pour chaque table/modification définie dans le schéma.
- [ ] Modifier si necessaire les entities pour chaque table/modification définie dans le schéma.
- [ ] Ajouter les index, contraintes d'unicité, foreign keys, etc.
- [ ] Generer les migrations avec la commande "npm run migration:generate -- ./src/database/migrations/NameDeLaMigration"
- [ ] Verifier que le migration generer sont correct
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
- pour creer les migration tu peux utiliser "npm run migration:generate -- ./src/database/migrations/NameDeLaMigration". Ensuite tu verifie que la generation est bonne.

## Dépendances
- Le schéma des tables doit être validé (voir tâche 9). 