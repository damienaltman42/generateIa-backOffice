# Tâche 11 — Mettre à jour les entités TypeORM

## Objectif
Aligner les entités TypeORM sur le schéma réel de la base de données pour garantir la cohérence et la maintenabilité du code.

## Étapes actionnables
- [ ] Mettre à jour ou créer les entités TypeORM pour chaque table (plans, subscriptions, audit_logs, etc.).
- [ ] Ajouter les relations, décorateurs et validations nécessaires.
- [ ] Vérifier la cohérence entre les entités et les migrations.
- [ ] Ajouter des commentaires et de la documentation dans le code des entités.

## Critères d'acceptation
- Les entités reflètent fidèlement le schéma de la BDD.
- Les relations et contraintes sont correctement implémentées.
- La documentation dans le code est à jour.

## Points de vigilance
- S'assurer que les modifications d'entités ne cassent pas les fonctionnalités existantes.
- Garder la compatibilité avec les scripts de migration.

## Conseils
- Utiliser les outils de génération automatique d'entités si possible.
- Relire les entités en équipe pour valider la cohérence métier.

## Dépendances
- Les migrations doivent être prêtes (voir tâche 10). 