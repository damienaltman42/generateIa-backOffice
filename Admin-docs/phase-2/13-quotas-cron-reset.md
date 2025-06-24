# Tâche 13 — CRON job pour reset mensuel des compteurs

## Objectif
Remettre à zéro automatiquement les compteurs de consommation des utilisateurs chaque mois, selon la politique de quotas.

## Étapes actionnables
- [ ] Définir la politique de reset (date, heure, fuseau, notification, etc.).
- [ ] Implémenter un job CRON pour le reset mensuel.
- [ ] Gérer les logs et la traçabilité du reset (qui, quand, combien de resets).
- [ ] Notifier les utilisateurs/admins du reset (optionnel).
- [ ] Tester le job sur un environnement de staging.

## Critères d'acceptation
- Les compteurs sont remis à zéro automatiquement chaque mois.
- Les resets sont tracés et consultables.
- Aucun compteur n'est oublié ou mal réinitialisé.

## Points de vigilance
- Gérer les cas de reset manuel ou exceptionnel (hors CRON).
- S'assurer que le job ne s'exécute qu'une seule fois par période.

## Conseils
- Prévoir une interface d'administration pour consulter l'historique des resets.
- Tester le job sur différents fuseaux horaires si besoin.

## Dépendances
- Les compteurs de consommation doivent être en place (tâche 12). 