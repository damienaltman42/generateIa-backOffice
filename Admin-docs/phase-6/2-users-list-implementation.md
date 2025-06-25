# Tâche 6.1 - Page Liste des Utilisateurs

## Objectif
Implémenter la page principale de gestion des utilisateurs avec table, recherche, filtres et pagination.

## Composants à créer

### 1. UsersListPage.tsx
```typescript
// Page principale qui orchestre tous les composants
- Gestion de l'état des filtres et pagination
- Appel API via React Query
- Affichage de la table et des contrôles
```

### 2. UserTable.tsx
```typescript
// Table Ant Design avec colonnes:
- Email (avec lien vers détail)
- Nom
- Plan (badge coloré)
- Statut (badge avec icône)
- Consommation (barres de progression)
- Date inscription
- Actions (dropdown menu)
```

### 3. UserFilters.tsx
```typescript
// Panneau de filtres avec:
- Recherche texte (email/nom)
- Select statut (Active/Suspended)
- Select plan (Free/Pro)
- RangePicker dates
- Select rôle (Admin/User)
- Slider consommation (0-100%)
- Bouton reset filtres
```

### 4. UserStatusBadge.tsx
```typescript
// Badge coloré selon statut:
- active: vert avec CheckCircle
- suspended: rouge avec StopOutlined
- trial: bleu avec ClockCircle
- expired: gris avec CloseCircle
```

### 5. ConsumptionProgress.tsx
```typescript
// Barres de progression pour quotas:
- Articles: X/Y (Z%)
- Posts: X/Y (Z%)
- Stories: X/Y (Z%)
- Code couleur selon %
```

## Structure des données

### Types TypeScript
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  company: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  articles_used: number;
  social_posts_used: number;
  stories_used: number;
  subscription: Subscription | null;
  plan: Plan | null;
  consumption_percentage: ConsumptionPercentage;
  effective_limits: EffectiveLimits;
  status: UserStatus;
  total_resources_created: ResourcesCount;
}

interface UsersListResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## Fonctionnalités clés

### 1. Recherche temps réel
- Debounce de 300ms
- Recherche dans email ET nom
- Indication de chargement

### 2. Filtres persistants
- Sauvegarde dans URL params
- Restauration au refresh
- Partage de liens filtrés

### 3. Actions rapides
- Voir détail (navigation)
- Suspendre/Réactiver (modal confirm)
- Envoyer email (ouverture client mail)
- Plus d'actions → dropdown

### 4. Tri des colonnes
- Tri serveur (pas client)
- Indicateurs visuels
- Multi-colonnes supporté

### 5. Pagination
- Controls en bas de table
- Sélecteur de taille (10/20/50/100)
- Navigation première/dernière page

## Gestion des états

### États de chargement
- Skeleton pendant chargement initial
- Spinner sur actions
- Optimistic updates

### États d'erreur
- Message d'erreur clair
- Bouton retry
- Fallback gracieux

### États vides
- Message explicatif
- Illustration
- Call-to-action si pertinent

## Performance

### Optimisations
- React.memo sur composants lourds
- useMemo pour calculs coûteux
- Virtualisation si > 100 lignes
- Lazy loading des actions

### Cache
- 5 minutes pour la liste
- Invalidation sur actions
- Prefetch au hover

## Accessibilité
- Navigation clavier complète
- Aria-labels sur actions
- Annonces des changements
- Focus management

## Tests
- Tests unitaires composants
- Tests d'intégration page
- Tests E2E parcours utilisateur
- Tests de performance 