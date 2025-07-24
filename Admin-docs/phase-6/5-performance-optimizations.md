# Tâche 6.4 - Optimisations de Performance

## Objectif
Optimiser les performances de l'interface utilisateurs pour gérer efficacement des milliers d'utilisateurs.

## Stratégies d'optimisation

### 1. Virtualisation de la liste

#### React Window
```typescript
import { FixedSizeList } from 'react-window';

const VirtualizedUserTable = ({ users, height }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UserRow user={users[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={height}
      itemCount={users.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

#### Seuil d'activation
- Activer si > 100 utilisateurs
- Hauteur de ligne fixe pour performance
- Overscan de 5 items

### 2. Pagination intelligente

#### Stratégie de cache
```typescript
// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Prefetch pages adjacentes
const prefetchAdjacentPages = (currentPage: number) => {
  if (currentPage > 1) {
    queryClient.prefetchQuery(['users', currentPage - 1]);
  }
  queryClient.prefetchQuery(['users', currentPage + 1]);
};
```

#### Infinite scroll (option)
```typescript
const { 
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage 
} = useInfiniteQuery({
  queryKey: ['users', filters],
  queryFn: ({ pageParam = 1 }) => fetchUsers({ ...filters, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
});
```

### 3. Debounce et throttle

#### Recherche avec debounce
```typescript
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const debouncedSearch = useDebounce(searchTerm, 300);
```

#### Scroll avec throttle
```typescript
const useThrottle = (callback: Function, delay: number) => {
  const lastCall = useRef(0);
  
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
};
```

### 4. Lazy loading des composants

#### Code splitting
```typescript
// Lazy load modals
const ModifyRightsModal = lazy(() => import('./modals/ModifyRightsModal'));
const AddCreditsModal = lazy(() => import('./modals/AddCreditsModal'));
const SuspendUserModal = lazy(() => import('./modals/SuspendUserModal'));

// Lazy load tabs
const UserConsumptionTab = lazy(() => import('./tabs/UserConsumptionTab'));
const UserHistoryTab = lazy(() => import('./tabs/UserHistoryTab'));
```

#### Suspense boundaries
```typescript
<Suspense fallback={<Spin size="large" />}>
  <Routes>
    <Route path="/users" element={<UsersListPage />} />
    <Route path="/users/:id" element={<UserDetailPage />} />
  </Routes>
</Suspense>
```

### 5. Optimisation des re-renders

#### React.memo
```typescript
const UserRow = React.memo(({ user, onAction }) => {
  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.name}</td>
      <td><UserStatusBadge status={user.status} /></td>
      <td><ConsumptionProgress user={user} /></td>
      <td><UserActionsDropdown user={user} onAction={onAction} /></td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.status === nextProps.user.status;
});
```

#### useMemo et useCallback
```typescript
const UserFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({});
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);
  
  return (
    // UI components
  );
};
```

### 6. Optimisation des requêtes

#### Batch requests
```typescript
// Au lieu de requêtes séparées
const batchUserDetails = async (userIds: string[]) => {
  const response = await api.post('/admin/users/batch', { ids: userIds });
  return response.data;
};
```

#### Field selection
```typescript
// Demander seulement les champs nécessaires
const fetchUsersList = async (params) => {
  return api.get('/admin/users', {
    params: {
      ...params,
      fields: 'id,email,name,status,plan,consumption_percentage'
    }
  });
};
```

### 7. Web Workers pour calculs lourds

#### Worker pour export CSV
```typescript
// exportWorker.ts
self.addEventListener('message', (event) => {
  const { users } = event.data;
  
  const csv = users.map(user => 
    [user.email, user.name, user.plan, user.status].join(',')
  ).join('\n');
  
  self.postMessage({ csv });
});

// Usage
const exportWorker = new Worker('/exportWorker.js');
exportWorker.postMessage({ users });
exportWorker.onmessage = (e) => {
  downloadCSV(e.data.csv);
};
```

## Métriques de performance

### Objectifs
- First Contentful Paint < 1s
- Time to Interactive < 2s
- Liste de 1000 users < 100ms render
- Recherche responsive < 50ms

### Monitoring
```typescript
// Performance observer
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
    // Send to analytics
  });
});

observer.observe({ entryTypes: ['measure'] });

// Mesures custom
performance.mark('users-list-start');
// ... render list
performance.mark('users-list-end');
performance.measure('users-list', 'users-list-start', 'users-list-end');
```

## Bundle optimization

### Analyse du bundle
```bash
npm run build -- --stats
npx webpack-bundle-analyzer build/stats.json
```

### Tree shaking
- Imports spécifiques Ant Design
- Suppression code mort
- Dynamic imports stratégiques 