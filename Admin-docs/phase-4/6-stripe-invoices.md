# Tâche 6 — Générer et stocker les factures, reçus, historiques de paiement

## Objectif
Permettre la consultation, le téléchargement et l'archivage des factures, reçus et historiques de paiement pour chaque utilisateur.

## Étapes actionnables
- [ ] Définir les informations à afficher/stocker (facture, reçu, date, montant, statut, etc.).
- [ ] Implémenter la génération et le stockage des factures/reçus (lien Stripe, PDF, etc.).
- [ ] Permettre la consultation et le téléchargement depuis l'admin.
- [ ] Gérer la sécurité et la confidentialité des données de paiement.
- [ ] Ajouter la documentation Swagger et des exemples de payloads/réponses.
- [ ] Tester les cas limites (facture manquante, accès non autorisé, etc.).

## Critères d'acceptation
- Les factures et reçus sont accessibles et téléchargeables depuis l'admin.
- L'accès est refusé aux non-admins.
- La documentation est à jour.

## Points de vigilance
- Protéger l'accès aux données sensibles (factures, logs Stripe).
- Gérer les cas de facture manquante ou d'erreur Stripe.

## Conseils
- Prévoir un historique de paiement consultable par période.
- Notifier l'utilisateur en cas de nouvelle facture ou de paiement échoué.

## Dépendances
- La synchronisation Stripe/BDD doit être en place (tâche 4). 