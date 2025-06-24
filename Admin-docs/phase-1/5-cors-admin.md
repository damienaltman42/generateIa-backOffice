# Tâche 5 — Configurer CORS pour n'autoriser que `admin.sowat.io`

## Objectif
Restreindre l'accès au backoffice admin à l'origine `admin.sowat.io` uniquement, pour éviter toute attaque cross-origin.

## Étapes actionnables
- [ ] Modifier la configuration CORS du backend pour n'accepter que l'origine `admin.sowat.io` sur les routes admin.
- [ ] Tester l'accès depuis d'autres domaines (doit être refusé).
- [ ] Documenter la configuration CORS dans le README technique.
- [ ] Prévoir la gestion des environnements (dev, staging, prod).

## Critères d'acceptation
- Toute requête provenant d'une origine autre que `admin.sowat.io` est refusée sur `/admin/*`.
- Les tests manuels/automatisés valident le blocage cross-origin.

## Points de vigilance
- Ne pas bloquer les outils de développement ou de test (prévoir des exceptions temporaires si besoin).
- S'assurer que la config CORS n'impacte pas les autres routes publiques.

## Conseils
- Utiliser des variables d'environnement pour gérer les origines autorisées selon l'environnement.
- Documenter les cas d'erreur courants liés à CORS.

## Dépendances
- La structure des modules admin doit être en place (voir tâche 1). 