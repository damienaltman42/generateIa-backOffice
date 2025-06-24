# Tâche 6 — Webhook/alerte automatique si taux d'échec > seuil

## Objectif
Alerter automatiquement les admins en cas de dépassement d'un seuil critique de taux d'échec des jobs.

## Étapes actionnables
- [ ] Définir le seuil critique et la politique d'alerte (email, Slack, etc.).
- [ ] Implémenter le calcul du taux d'échec en temps réel ou différé.
- [ ] Déclencher l'alerte automatiquement en cas de dépassement.
- [ ] Gérer la traçabilité des alertes envoyées (logs, audit trail).
- [ ] Tester le système d'alerte sur différents scénarios (pic, retour à la normale, etc.).

## Critères d'acceptation
- Les alertes sont envoyées en temps voulu et aux bonnes personnes.
- Les alertes sont tracées et consultables.

## Points de vigilance
- Éviter le spam d'alertes (cooldown, seuils dynamiques).
- S'assurer de la fiabilité du déclenchement (pas de faux positifs/negatifs).

## Conseils
- Prévoir une interface pour consulter l'historique des alertes.
- Tester le système sur des volumes réels ou simulés.

## Dépendances
- Les statistiques jobs doivent être en place (tâche 5). 