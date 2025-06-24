# Tâche 1 — Définir la structure des modules backend

## Objectif
Mettre en place une structure claire et évolutive pour le module admin, distincte du reste de l'application backend.

## Étapes actionnables
- [ ] Créer un dossier/module `admin` dédié dans le backend.
- [ ] Organiser les contrôleurs, services et routes spécifiques à l'admin dans ce module.
- [ ] Préparer un dossier pour les guards et décorateurs liés à l'admin (ex : `admin/guards`, `admin/decorators`).
- [ ] Définir une convention de nommage pour les fichiers et dossiers admin.
- [ ] Documenter la structure dans un README du module admin.

## Critères d'acceptation
- Le module admin est isolé et bien identifié dans l'architecture backend.
- Les fichiers liés à la sécurité admin sont regroupés et facilement localisables.
- La documentation de structure est à jour.

## Points de vigilance
- Ne pas mélanger les routes admin et utilisateur dans les mêmes contrôleurs.
- Prévoir l'extension future (RBAC, nouveaux contrôleurs admin).

## Conseils
- S'inspirer des bonnes pratiques NestJS pour la modularisation.
- Valider la structure avec l'équipe avant d'implémenter les guards.

## Dépendances
- Aucune, cette tâche est le point de départ de la phase 1. 