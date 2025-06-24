# Tâche 2 — Mettre en place un guard d'authentification JWT pour les routes admin

## Objectif
Garantir que seules les requêtes authentifiées via JWT peuvent accéder aux routes `/admin/*`.

## Étapes actionnables
- [ ] Vérifier l'existence et la configuration du guard JWT global.
- [ ] Appliquer explicitement le guard JWT à tous les contrôleurs/routes admin.
- [ ] Tester l'accès sans token, avec token invalide, avec token expiré.
- [ ] Documenter la logique d'authentification dans le README du module admin.

## Critères d'acceptation
- Toute requête non authentifiée ou avec un JWT invalide/expiré est refusée sur `/admin/*`.
- Les tests unitaires/E2E couvrent tous les cas d'accès (valide, invalide, expiré, absent).

## Points de vigilance
- Ne pas oublier d'appliquer le guard sur les nouveaux contrôleurs admin créés ultérieurement.
- S'assurer que le guard ne bloque pas les routes publiques (ex : login).

## Conseils
- Utiliser les outils de test automatisé pour simuler différents scénarios JWT.
- Documenter les cas d'erreur courants pour faciliter le support.

## Dépendances
- La structure des modules admin doit être en place (voir tâche 1). 