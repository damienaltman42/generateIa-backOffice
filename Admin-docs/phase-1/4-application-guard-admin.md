# Tâche 4 — Appliquer le guard de rôle à toutes les routes `/admin/*`

## Objectif
S'assurer que toutes les routes admin sont protégées par le guard de rôle admin, sans exception.

## Étapes actionnables
- [ ] Passer en revue tous les contrôleurs et endpoints admin existants.
- [ ] Appliquer explicitement le guard de rôle à chaque route ou au module admin globalement.
- [ ] Vérifier qu'aucune route admin n'est accessible à un utilisateur non admin.
- [ ] Ajouter des tests E2E pour valider la protection de toutes les routes.
- [ ] Mettre à jour la documentation pour indiquer la protection systématique.

## Critères d'acceptation
- Toutes les routes `/admin/*` sont inaccessibles aux non-admins.
- Les tests E2E échouent si une route admin est accessible sans le rôle admin.

## Points de vigilance
- Ne pas oublier les routes créées ultérieurement (processus à documenter).
- S'assurer que la protection est centralisée (éviter la dispersion des guards).

## Conseils
- Utiliser un middleware ou une application globale du guard si possible.
- Ajouter une checklist de vérification lors de la création de nouvelles routes admin.

## Dépendances
- Le guard de rôle admin doit être opérationnel (voir tâche 3). 