# Tâche 6.2 - Page Détail Utilisateur

## Objectif
Implémenter la page de détail d'un utilisateur avec navigation par onglets et toutes les informations disponibles.

## Structure de la page

### Header
```typescript
// En-tête avec:
- Breadcrumb: Dashboard > Utilisateurs > [Email]
- Titre: Nom de l'utilisateur
- Badge statut
- Boutons d'actions alignés à droite
```

### Onglets
1. **Profil** - Informations générales
2. **Consommation** - Statistiques et graphiques
3. **Historique** - Audit trail
4. **Ressources** - Contenu créé
5. **Facturation** - Abonnement et paiements

## Composants par onglet

### 1. UserProfileTab.tsx
```typescript
// Informations affichées:
- Email (avec badge vérifié si applicable)
- Nom complet
- Entreprise
- Date d'inscription
- Dernière connexion
- Rôle (User/Admin)
- Statut compte
- Plan actuel avec limites
- Crédits supplémentaires
```

### 2. UserConsumptionTab.tsx
```typescript
// Visualisations:
- Cartes de métriques (consommation actuelle)
- Graphique en ligne (évolution 12 mois)
- Graphique en barres (comparaison périodes)
- Tableau détaillé par mois
- Prévisions d'épuisement
- Score d'engagement (0-100)
```

### 3. UserHistoryTab.tsx
```typescript
// Timeline d'actions:
- Filtres par type d'action
- Recherche dans les actions
- Affichage chronologique
- Détails de chaque action
- Admin ayant effectué l'action
- Pagination
```

### 4. UserResourcesTab.tsx
```typescript
// Ressources créées:
- Tabs: Articles | Posts | Stories | Images
- Table avec preview
- Filtres par date/statut
- Actions (voir, éditer, supprimer)
- Statistiques par type
```

### 5. UserBillingTab.tsx
```typescript
// Informations de facturation:
- Plan actuel et prix
- Historique des paiements
- Prochaine facture
- Méthode de paiement
- Invoices téléchargeables
- Lifetime Value (LTV)
```

## Actions disponibles

### Dans le header
```typescript
const actions = [
  {
    label: "Modifier droits",
    icon: <UserSwitchOutlined />,
    action: "rights",
    danger: isAdmin
  },
  {
    label: "Ajouter crédits",
    icon: <PlusCircleOutlined />,
    action: "quotas"
  },
  {
    label: isSuspended ? "Réactiver" : "Suspendre",
    icon: <StopOutlined />,
    action: "suspend",
    danger: !isSuspended
  },
  {
    label: "Réinitialiser mot de passe",
    icon: <LockOutlined />,
    action: "reset-password"
  }
];
```

### Modales d'action

#### Modal Modifier Droits
- Switch Admin On/Off
- Confirmation si retrait droits admin
- Message d'avertissement

#### Modal Ajouter Crédits
- Input nombre articles
- Input nombre posts
- Input nombre stories
- Calcul du coût total
- Raison (optionnelle)

#### Modal Suspendre/Réactiver
- Raison (obligatoire)
- Date de fin (optionnelle)
- Notification utilisateur (checkbox)

#### Modal Reset Password
- Confirmation simple
- Option d'email personnalisé

## Graphiques et visualisations

### Graphique consommation (Line Chart)
```typescript
const chartConfig = {
  xField: 'month',
  yField: 'value',
  seriesField: 'type',
  smooth: true,
  legend: { position: 'top-left' },
  tooltip: { showMarkers: true }
};
```

### Métriques clés (Cards)
- Consommation ce mois
- Tendance vs mois dernier
- Jours avant reset
- Taux d'utilisation

### Score d'engagement (Gauge)
- 0-30: Faible (rouge)
- 31-70: Moyen (orange)
- 71-100: Élevé (vert)

## Gestion des données

### Hooks personnalisés
```typescript
// useUserDetail.ts
- Fetch données complètes
- Cache 5 minutes
- Refetch sur focus

// useUserConsumption.ts
- Historique 12 mois
- Agrégation par période
- Calculs statistiques

// useUserActions.ts
- Mutations avec optimistic update
- Gestion erreurs
- Invalidation cache
```

### États de chargement
- Skeleton pour chaque section
- Progressive enhancement
- Lazy loading des onglets

## Responsive Design
- Stack vertical sur mobile
- Onglets → Accordion
- Actions → Bottom sheet
- Graphiques adaptés

## Sécurité
- Vérification permissions avant actions
- Confirmation pour actions critiques
- Audit trail de toutes les actions
- Rate limiting côté client 