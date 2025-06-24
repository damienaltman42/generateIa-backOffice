# Tâche 5 — Endpoint pour supprimer un utilisateur (double confirmation, audit trail)

## Objectif
Permettre à l'admin de supprimer un utilisateur de façon sécurisée, traçable et conforme RGPD.

## Étapes actionnables
- [ ] Implémenter la suppression avec double confirmation (UI + backend).
- [ ] Tracer l'action dans l'audit trail (qui, quand, pourquoi).
- [ ] Gérer la suppression logique ou physique selon la politique RGPD.
- [ ] Gérer les droits d'accès (seuls les admins peuvent accéder à cet endpoint).
- [ ] Ajouter la documentation Swagger et un exemple de payload/réponse.
- [ ] Tester les cas limites (utilisateur inexistant, suppression interdite, etc.).

## Critères d'acceptation
- La suppression est effective, sécurisée et tracée dans l'audit trail.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Respecter la conformité RGPD (droit à l'oubli, anonymisation si besoin).
- Protéger l'action par une double confirmation.

## Conseils
- Notifier l'utilisateur en cas de suppression de son compte.
- Prévoir un log détaillé pour les audits futurs.

## Dépendances
- L'endpoint détail utilisateur doit être en place (tâche 2). 