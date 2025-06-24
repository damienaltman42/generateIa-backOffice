# Tâche 12 — Incrémentation automatique des compteurs de consommation

## Objectif
Mettre à jour automatiquement les compteurs de consommation des utilisateurs à chaque action concernée (article, image, post, etc.).

## Étapes actionnables
- [ ] Identifier toutes les actions qui doivent incrémenter un compteur (génération, publication, etc.).
- [ ] Implémenter l'incrémentation dans les services concernés.
- [ ] S'assurer de l'atomicité des opérations (pas de double incrément).
- [ ] Gérer les droits d'accès (seuls les admins peuvent modifier manuellement).
- [ ] Ajouter des logs pour chaque incrémentation.
- [ ] Tester tous les cas (succès, échec, rollback).

## Critères d'acceptation
- Les compteurs sont incrémentés de façon fiable à chaque action.
- Aucun double comptage ou oubli d'incrémentation.
- Les logs sont complets.

## Points de vigilance
- Gérer les cas de rollback (action échouée, annulation).
- S'assurer de la cohérence des compteurs lors des migrations de plan.

## Conseils
- Utiliser des transactions pour garantir l'atomicité.
- Prévoir des tests de charge pour valider la robustesse.

## Dépendances
- La logique de quotas doit être en place (tâche 11). 