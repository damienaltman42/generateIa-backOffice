# Tâche 11 — Logique de vérification des quotas à chaque action utilisateur

## Objectif
Garantir que les quotas définis par les plans sont respectés à chaque action utilisateur (génération d'article, image, post, etc.).

## Étapes actionnables
- [ ] Définir les règles de vérification des quotas pour chaque type d'action.
- [ ] Implémenter la vérification des quotas dans les services concernés (articles, images, social, etc.).
- [ ] Bloquer ou alerter en cas de dépassement de quota.
- [ ] Gérer les droits d'accès (seuls les admins peuvent override).
- [ ] Ajouter la documentation technique sur la logique de quotas.
- [ ] Tester tous les cas (dépassement, limite atteinte, override admin).

## Critères d'acceptation
- Les quotas sont vérifiés à chaque action utilisateur.
- Les dépassements sont bloqués ou alertés selon la politique définie.
- Les overrides admin sont tracés.

## Points de vigilance
- S'assurer que la vérification est centralisée et non dupliquée.
- Gérer les cas de synchronisation lors des changements de plan.

## Conseils
- Prévoir des logs détaillés pour les dépassements et overrides.
- Tester la logique sur des cas limites (utilisateur changeant de plan, quotas multiples).

## Dépendances
- Les plans et quotas doivent être en place (tâches 9 et 10). 