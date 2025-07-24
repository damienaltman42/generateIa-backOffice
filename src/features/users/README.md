# Module Utilisateurs

## Vue d'ensemble
Module complet de gestion des utilisateurs pour le backoffice administrateur.

## Tâches complétées

### Tâche 6.1 - Page Liste des Utilisateurs ✅
Page principale affichant la liste des utilisateurs avec :
- Table paginée avec colonnes fixes
- Recherche par email/nom (debounce 300ms)
- Filtres multiples (statut, plan, dates, rôle, consommation)
- Tri serveur sur colonnes
- Actions rapides via dropdown
- Badges de statut colorés
- Barres de progression pour les quotas
- Responsive design

### Tâche 6.2 - Page Détail Utilisateur ✅
Page détail complète avec navigation par onglets :

#### Onglets implémentés
1. **Profil** - Informations générales de l'utilisateur
   - Email avec badge de vérification
   - Nom, entreprise, rôle
   - Dates d'inscription et dernière connexion
   - Plan actuel et limites
   - Crédits supplémentaires

2. **Consommation** - Statistiques et graphiques
   - Cartes de métriques (taux, tendance, jours restants)
   - Score d'engagement avec jauge
   - Graphique en ligne (évolution 12 mois)
   - Graphique en barres (comparaison périodes)
   - Tableau détaillé par mois
   - Prévisions d'épuisement

3. **Historique** - Timeline des actions
   - Filtres par type d'action et dates
   - Recherche dans l'historique
   - Affichage chronologique avec icônes
   - Détails de chaque action
   - Pagination

4. **Ressources** - Contenu créé par l'utilisateur
   - Tabs pour Articles/Posts/Images
   - Statistiques par type
   - Tables avec aperçus
   - Filtres par date et statut
   - Actions sur les ressources

5. **Facturation** - Informations d'abonnement
   - Métriques (LTV, paiements, durée)
   - Détails de l'abonnement actuel
   - Historique des paiements (simulé)
   - Actions de gestion

#### Modales d'actions
- **UpdateRightsModal** - Modifier les droits admin
- **UpdateQuotasModal** - Ajouter des crédits
- **SuspendUserModal** - Suspendre/réactiver
- **ResetPasswordModal** - Réinitialiser le mot de passe

## Structure des fichiers

```
features/users/
├── pages/
│   ├── UsersListPage.tsx    # Page liste
│   └── UserDetailPage.tsx    # Page détail
├── components/
│   ├── UserTable.tsx         # Table principale
│   ├── UserFilters.tsx       # Panneau de filtres
│   ├── UserStatusBadge.tsx   # Badge de statut
│   ├── ConsumptionProgress.tsx # Barres de progression
│   ├── UserActionsDropdown.tsx # Menu d'actions
│   ├── UserProfileTab.tsx    # Onglet profil
│   ├── UserConsumptionTab.tsx # Onglet consommation
│   ├── UserHistoryTab.tsx    # Onglet historique
│   ├── UserResourcesTab.tsx  # Onglet ressources
│   ├── UserBillingTab.tsx    # Onglet facturation
│   ├── UpdateRightsModal.tsx # Modal droits
│   ├── UpdateQuotasModal.tsx # Modal crédits
│   ├── SuspendUserModal.tsx  # Modal suspension
│   └── ResetPasswordModal.tsx # Modal mot de passe
├── hooks/
│   ├── useUsersList.ts       # Hook liste utilisateurs
│   ├── useUserDetail.ts      # Hooks détail utilisateur
│   └── useUserActions.ts     # Hook actions utilisateur
├── api/
│   └── usersApi.ts          # Client API
├── types/
│   └── users.types.ts       # Types TypeScript
└── index.ts                 # Exports du module
```

## Navigation
- Clic sur l'email dans la table → page détail
- Action "Voir détails" dans le dropdown → page détail
- Bouton retour dans la page détail → retour à la liste
- Breadcrumb pour navigation hiérarchique

## Performance
- Cache React Query 5 minutes
- Debounce recherche 300ms
- Lazy loading des onglets
- Optimistic updates sur les actions

## Prochaines étapes
- Intégration avec l'API backend réelle
- Ajout de tests unitaires et E2E
- Optimisations performance (virtualisation)
- Export des données (CSV/Excel) 