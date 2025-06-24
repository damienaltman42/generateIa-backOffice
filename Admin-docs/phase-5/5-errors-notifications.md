# Tâche 5 — Gestion des erreurs et des notifications globales

## Objectif
Centraliser la gestion des erreurs et des notifications pour offrir une UX cohérente et réactive sur tout le backoffice admin.

## Étapes actionnables
- [ ] Mettre en place un système global de gestion des erreurs (API, UI).
- [ ] Intégrer un système de notifications (succès, échec, alertes, warnings).
- [ ] Prévoir la gestion des erreurs backend (affichage clair, logs, retry).
- [ ] Tester l'affichage et la gestion des notifications sur tous les devices.

## Critères d'acceptation
- Les erreurs et notifications sont affichées de façon cohérente et non intrusive.
- Les notifications critiques sont visibles et actionnables.

## Points de vigilance
- Ne pas noyer l'utilisateur sous les notifications.
- Gérer les erreurs réseau ou backend de façon claire.

## Conseils
- Utiliser des hooks custom pour la gestion des notifications.
- Prévoir une file d'attente ou un historique des notifications.

## Dépendances
- Le layout général doit être en place (tâche 3). 