# Tâche 3 — Endpoint POST `/admin/jobs/:id/retry` (relancer un job échoué)

## Objectif
Permettre à l'admin de relancer un job échoué de façon sécurisée, traçable et contrôlée.

## Étapes actionnables
- [ ] Définir la logique de relance (conditions, limitations, audit trail).
- [ ] Implémenter l'endpoint POST `/admin/jobs/:id/retry`.
- [ ] Tracer l'action dans l'audit trail (qui, quand, pourquoi).
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de payload/réponse.
- [ ] Tester les cas limites (job inexistant, déjà relancé, relance interdite, etc.).

## Critères d'acceptation
- La relance est effective, sécurisée et tracée dans l'audit trail.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Limiter le nombre de relances pour éviter les boucles ou abus.
- Protéger l'action par une confirmation ou une double validation.

## Conseils
- Notifier l'admin en cas d'échec de la relance.
- Prévoir un log détaillé pour les audits futurs.

## Dépendances
- L'endpoint jobs failed doit être en place (tâche 2). 