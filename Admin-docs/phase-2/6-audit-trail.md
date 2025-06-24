# Tâche 6 — Intégrer l'audit trail sur toutes les actions admin

## Objectif
Assurer la traçabilité complète de toutes les actions critiques réalisées par les admins sur les utilisateurs.

## Étapes actionnables
- [ ] Définir la liste des actions à tracer (modification droits, suppression, reset quotas, etc.).
- [ ] Implémenter la logique d'audit trail (qui, quoi, quand, pourquoi).
- [ ] Stocker les logs d'audit dans la table dédiée.
- [ ] Permettre la consultation de l'audit trail par les admins (endpoint, UI).
- [ ] Tester la cohérence et l'exhaustivité des logs générés.

## Critères d'acceptation
- Toutes les actions critiques sont tracées et consultables.
- Les logs sont complets, horodatés et attribués à un admin.

## Points de vigilance
- Ne pas tracer d'informations sensibles (mot de passe, token).
- S'assurer de la performance et de la scalabilité du système de logs.

## Conseils
- Prévoir des filtres et une pagination pour la consultation des logs.
- Documenter la politique d'audit trail (quelles actions, durée de conservation, etc.).

## Dépendances
- Les endpoints admin users doivent être en place. 