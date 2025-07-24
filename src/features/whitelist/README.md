# Module Whitelist - BackOffice

## Vue d'ensemble

Le module Whitelist permet aux administrateurs de gérer la liste d'attente des utilisateurs et de les migrer vers des comptes actifs.

## Structure

```
whitelist/
├── api/
│   └── whitelistApi.ts          # Client API pour les endpoints whitelist
├── components/
│   ├── WhitelistStats.tsx       # Composant des statistiques
│   └── WhitelistTable.tsx       # Table de gestion des entrées
├── hooks/
│   ├── useWhitelistData.ts      # Hooks pour récupérer les données
│   └── useWhitelistActions.ts   # Hooks pour les actions (migrations)
├── pages/
│   └── WhitelistManagementPage.tsx # Page principale de gestion
├── types/
│   └── whitelist.types.ts       # Types TypeScript
└── index.ts                     # Exports du module
```

## Fonctionnalités

### 1. Statistiques en temps réel
- Total des inscriptions
- Emails confirmés (avec taux de confirmation)
- Utilisateurs migrés (avec taux de migration)
- En attente de migration

### 2. Gestion des entrées
- **Liste paginée** avec tri et filtres
- **Recherche** par email
- **Filtres** par statut (confirmé, migré)
- **Actions contextuelles** selon le statut

### 3. Migration d'utilisateurs
- **Migration individuelle** avec raison obligatoire
- **Migration en lot** (à implémenter)
- **Validation** avant migration
- **Feedback** utilisateur avec messages de succès/erreur

### 4. Interface responsive
- Adaptation mobile/desktop
- Tables scrollables horizontalement
- Composants Antd optimisés

## API Endpoints utilisés

- `GET /admin/whitelist` - Liste paginée avec filtres
- `GET /admin/whitelist/stats` - Statistiques globales  
- `POST /admin/whitelist/migrate` - Migration individuelle
- `POST /admin/whitelist/migrate/batch` - Migration en lot

## Types de données

### WhitelistEntry
```typescript
interface WhitelistEntry {
  id: string;
  email: string;
  source: string;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  migratedAt?: string;
  migratedUserId?: string;
  ipAddress?: string;
  userAgent?: string;
}
```

### WhitelistStats
```typescript
interface WhitelistStats {
  total: number;
  confirmed: number;
  migrated: number;
  eligible: number;
  pending: number;
  confirmationRate: number;
  migrationRate: number;
}
```

## Hooks

### useWhitelistData
- `useWhitelistList(params)` - Liste avec pagination/filtres
- `useWhitelistStats()` - Statistiques globales

### useWhitelistActions  
- `migrateSingle` - Migration d'un utilisateur
- `migrateBatch` - Migration en lot

## Gestion d'état

- **React Query** pour le cache et la synchronisation
- **Invalidation automatique** après mutations
- **Loading states** et gestion d'erreurs
- **Messages de feedback** utilisateur

## Sécurité

- Routes protégées par middleware admin
- Validation des données côté client et serveur
- Gestion des erreurs avec messages appropriés

## Prochaines étapes

1. **Migration en lot** - Interface pour sélectionner plusieurs utilisateurs
2. **Export CSV** - Téléchargement des données
3. **Filtres avancés** - Date range, source, etc.
4. **Audit trail** - Historique des migrations
5. **Tests unitaires** - Couverture des composants et hooks

## Notes techniques

- Compatible avec React 18+ et TypeScript 5+
- Utilise Antd pour l'interface utilisateur
- React Query pour la gestion d'état serveur
- Responsive design avec hooks personnalisés 