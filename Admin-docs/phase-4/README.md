# Phase 4 — Intégration Stripe & Billing du Backoffice Admin

## Objectif général
Permettre la gestion complète, sécurisée et traçable des abonnements utilisateurs via Stripe, avec synchronisation des statuts, gestion des plans, facturation, webhooks et conformité.

---

## Epic 6 : Stripe & Gestion des abonnements

### Objectifs
- Intégrer Stripe pour la gestion des abonnements, paiements et plans d'utilisateurs.
- Synchroniser en temps réel les statuts d'abonnement entre Stripe et la BDD locale.
- Permettre la gestion des plans, la consultation des factures et l'historique de paiement depuis l'admin.
- Garantir la sécurité, la traçabilité et la conformité RGPD/SOC2 de toutes les opérations Stripe.

### Sous-tâches & Checklist

#### 1. Intégrer le SDK Stripe côté backend (configuration, clés, sécurité)
- [ ] Configurer le SDK Stripe avec les clés et paramètres sécurisés.
- [ ] Gérer la sécurité des clés et la rotation éventuelle.

#### 2. Créer les endpoints `/admin/subscriptions` (listing, détail, modification, annulation)
- [ ] Permettre aux admins de lister, consulter, modifier et annuler les abonnements utilisateurs.
- [ ] Afficher les informations clés (plan, statut, dates, factures, etc.).

#### 3. Implémenter les webhooks Stripe (paiement réussi, échec, changement de plan, annulation, etc.)
- [ ] Recevoir et traiter les événements Stripe critiques.
- [ ] Mettre à jour la BDD locale en fonction des événements reçus.
- [ ] Sécuriser les webhooks (signature, idempotence).

#### 4. Synchroniser le statut d'abonnement Stripe avec la BDD locale (`subscriptions`)
- [ ] Garantir la cohérence des statuts entre Stripe et la BDD.
- [ ] Gérer les cas de désynchronisation ou d'erreur.

#### 5. Gérer la création et la modification des plans Stripe depuis l'admin (optionnel)
- [ ] Permettre la création/modification de plans Stripe via l'admin (si besoin).
- [ ] Synchroniser les plans entre Stripe et la BDD.

#### 6. Générer et stocker les factures, reçus, historiques de paiement
- [ ] Permettre la consultation et le téléchargement des factures/reçus.
- [ ] Stocker l'historique de paiement pour chaque utilisateur.

#### 7. Ajouter des tests unitaires et E2E sur la gestion des abonnements
- [ ] Couvrir tous les cas critiques (création, modification, annulation, échec, désynchro).

#### 8. Documenter la gestion Stripe (README, Swagger)
- [ ] Rédiger la documentation technique et fonctionnelle de l'intégration Stripe.
- [ ] Ajouter des exemples de payloads, réponses, erreurs, webhooks.

---

### Livrables attendus
- API d'abonnement Stripe complète, sécurisée, documentée.
- Webhooks opérationnels et documentés.
- Synchronisation fiable des statuts et des plans.
- Factures et historiques accessibles depuis l'admin.

---

### Critères de succès
- Les changements d'abonnement Stripe sont reflétés en temps réel côté admin.
- Les factures et statuts sont accessibles et fiables.
- Les tests couvrent tous les cas critiques et d'accès.

---

### Points de vigilance
- Sécuriser les webhooks Stripe (signature, idempotence, logs).
- Gérer les cas de désynchronisation (paiement échoué non reçu, annulation non propagée).
- Protéger l'accès aux données sensibles (factures, statuts, logs Stripe).
- S'assurer de la conformité RGPD/SOC2 (logs, suppression, export, etc.).

---

### Conseils de mise en œuvre
- Impliquer l'équipe produit et finance pour valider les besoins métiers (plans, factures, statuts).
- Tester l'intégration Stripe sur un environnement de test avant la prod.
- Versionner la documentation de l'API et des webhooks.
- Prévoir des alertes en cas d'échec de synchronisation ou de paiement. 