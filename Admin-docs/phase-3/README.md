# Phase 3 — Monitoring & Jobs du Backoffice Admin

## Objectif général
Offrir aux admins une supervision complète, sécurisée et traçable de tous les jobs (génération, publication, etc.), avec la possibilité de relancer, supprimer, auditer et monitorer les jobs échoués ou en cours.

---

## Epic 5 : API Jobs Management

### Objectifs
- Permettre aux admins de lister, filtrer, relancer, supprimer et auditer tous les jobs (articles, images, social, etc.).
- Fournir des statistiques agrégées (taux d'échec, jobs en attente, temps moyen, etc.) et des alertes en cas d'incident.
- Assurer la traçabilité complète (audit trail) et la sécurité d'accès à toutes les opérations sur les jobs.

### Sous-tâches & Checklist

#### 1. Endpoint `/admin/jobs` (listing, filtres par statut, type, date)
- [ ] Permettre la recherche, le filtrage (statut, type, date, user) et la pagination des jobs.
- [ ] Afficher les informations clés (type, statut, date, user, durée, etc.).

#### 2. Endpoint `/admin/jobs/failed` (liste des jobs échoués, détails, stacktrace)
- [ ] Lister les jobs échoués avec accès au détail, à l'erreur et au stacktrace.
- [ ] Permettre la recherche par type, date, user, message d'erreur.

#### 3. Endpoint POST `/admin/jobs/:id/retry` (relancer un job échoué)
- [ ] Permettre à l'admin de relancer un job échoué de façon sécurisée et traçable.
- [ ] Tracer l'action dans l'audit trail.

#### 4. Endpoint DELETE `/admin/jobs/:id` (suppression/purge d'un job)
- [ ] Permettre la suppression ou la purge d'un job (échoué, terminé, en attente).
- [ ] Protéger l'action par une confirmation et tracer dans l'audit trail.

#### 5. Statistiques agrégées (taux d'échec, temps moyen, jobs en attente)
- [ ] Calculer et exposer des statistiques globales et par type de job.
- [ ] Afficher les tendances (évolution du taux d'échec, volume, etc.).

#### 6. Webhook/alerte automatique si taux d'échec > seuil
- [ ] Définir un seuil critique de taux d'échec.
- [ ] Implémenter un système d'alerte (email, Slack, etc.) en cas de dépassement.

#### 7. Historique des actions sur les jobs (audit trail)
- [ ] Tracer toutes les actions critiques sur les jobs (relance, suppression, etc.).
- [ ] Permettre la consultation de l'audit trail par les admins.

#### 8. Tests unitaires et E2E sur la gestion des jobs
- [ ] Couvrir tous les cas critiques (relance, suppression, accès refusé, etc.).

#### 9. Documentation API et monitoring
- [ ] Rédiger la documentation technique et fonctionnelle de l'API jobs (Swagger, README, exemples d'usage).

---

### Livrables attendus
- API de monitoring des jobs complète, sécurisée, documentée.
- Dashboard admin (statistiques, alertes, logs).
- Audit trail opérationnel sur toutes les actions critiques.

---

### Critères de succès
- Les admins peuvent relancer/supprimer n'importe quel job échoué ou en attente.
- Les alertes sont envoyées en cas d'incident massif ou de dépassement de seuil critique.
- Toutes les actions sont tracées et consultables dans l'audit trail.
- Les tests couvrent tous les cas critiques et d'accès.

---

### Points de vigilance
- Protéger les endpoints critiques (relance/suppression massive) par confirmation et logs.
- S'assurer de la cohérence des stats et de l'audit trail.
- Optimiser les requêtes pour éviter les lenteurs sur de gros volumes de jobs.
- Gérer la sécurité d'accès (seuls les admins peuvent accéder à ces endpoints).

---

### Conseils de mise en œuvre
- Impliquer l'équipe produit pour définir les besoins de monitoring et d'alertes.
- Prévoir une interface d'administration claire pour la consultation et l'action sur les jobs.
- Tester la robustesse et la performance sur un environnement de staging avec des volumes réels.
- Versionner la documentation de l'API et des alertes. 