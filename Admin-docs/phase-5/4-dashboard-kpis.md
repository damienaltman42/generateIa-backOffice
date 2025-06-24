# Tâche 4 — Dashboard principal avec KPIs (utilisateurs actifs, jobs échoués, MRR, etc.)

## Objectif
Fournir aux admins une vue synthétique et actionnable de l'état de la plateforme via des indicateurs clés (KPIs).

## Étapes actionnables
- [ ] Définir les KPIs à afficher (utilisateurs actifs, jobs échoués, MRR, etc.).
- [ ] Concevoir les composants graphiques (cards, graphiques, alertes).
- [ ] Intégrer les données en temps réel ou quasi-réel depuis l'API backend.
- [ ] Prévoir des liens rapides vers les pages d'action (utilisateurs, jobs, etc.).
- [ ] Tester l'affichage sur tous les devices.

## Critères d'acceptation
- Les KPIs sont à jour, lisibles et actionnables.
- Le dashboard est responsive et accessible.

## Points de vigilance
- Ne pas surcharger le dashboard (prioriser les KPIs critiques).
- Gérer les cas d'erreur ou d'indisponibilité des données.

## Conseils
- Utiliser des librairies de graphiques éprouvées (Recharts, Chart.js, etc.).
- Prévoir des placeholders/squelettes pour le chargement des données.

## Dépendances
- Les endpoints backend pour les KPIs doivent être en place. 