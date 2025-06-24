# Tâche 5 — Gérer la création et la modification des plans Stripe depuis l’admin (optionnel)

## Objectif
Permettre la création et la modification des plans Stripe directement depuis l’admin, avec synchronisation vers la BDD locale.

## Étapes actionnables
- [ ] Définir les champs et options modifiables pour les plans Stripe.
- [ ] Implémenter les endpoints de création/modification de plans Stripe (si besoin).
- [ ] Synchroniser les plans entre Stripe et la BDD locale.
- [ ] Gérer les droits d’accès (seuls les admins peuvent accéder à ces endpoints).
- [ ] Ajouter la documentation Swagger et des exemples de payloads/réponses.
- [ ] Tester les cas limites (plan existant, modification interdite, etc.).

## Critères d’acceptation
- Les plans Stripe peuvent être créés/modifiés depuis l’admin (si activé).
- La synchronisation avec la BDD est fiable.
- L’accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger les actions critiques (création, modification de plan).
- Gérer la cohérence entre Stripe et la BDD locale.

## Conseils
- Notifier les utilisateurs en cas de changement de plan global.
- Prévoir un historique des modifications de plan (audit trail).

## Dépendances
- Le SDK Stripe doit être configuré (tâche 1). 