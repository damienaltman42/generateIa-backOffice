# Tâche 6.3 - Actions Utilisateurs

## Objectif
Implémenter toutes les actions administratives sur les utilisateurs avec gestion des erreurs et feedback.

## Actions disponibles

### 1. Modifier les droits admin
**Endpoint**: PATCH /admin/users/:id/rights

#### Workflow
1. Clic sur "Modifier droits"
2. Modal avec switch Admin On/Off
3. Si retrait admin → confirmation supplémentaire
4. Vérification qu'il reste au moins 1 admin
5. Appel API avec gestion erreur
6. Notification succès/échec
7. Refresh des données

#### Composant ModifyRightsModal.tsx
```typescript
interface ModifyRightsModalProps {
  user: User;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Validations:
- Empêcher auto-retrait droits admin
- Vérifier dernier admin
- Message d'avertissement clair
```

### 2. Ajouter des crédits
**Endpoint**: PATCH /admin/users/:id/quotas

#### Workflow
1. Clic sur "Ajouter crédits"
2. Modal avec formulaire
3. Saisie quantités par type
4. Calcul automatique du coût
5. Validation montants positifs
6. Appel API
7. Mise à jour immédiate UI

#### Composant AddCreditsModal.tsx
```typescript
interface AddCreditsForm {
  articles: number;
  socialPosts: number;
  stories: number;
  reason?: string;
}

// Features:
- Inputs numériques avec + / -
- Prix unitaire affiché (3€)
- Total calculé en temps réel
- Historique ajouts précédents
```

### 3. Suspendre/Réactiver compte
**Endpoint**: PATCH /admin/users/:id/suspend

#### Workflow
1. Clic sur "Suspendre" ou "Réactiver"
2. Modal de confirmation
3. Saisie raison obligatoire
4. Option notification email
5. Confirmation action
6. Update optimistic UI
7. Rollback si erreur

#### Composant SuspendUserModal.tsx
```typescript
interface SuspendUserForm {
  action: 'suspend' | 'reactivate';
  reason: string;
  notifyUser: boolean;
  endDate?: string; // Pour suspension temporaire
}

// Validations:
- Raison min 10 caractères
- Date fin > aujourd'hui
- Message différent selon action
```

### 4. Réinitialiser mot de passe
**Endpoint**: POST /admin/users/:id/reset-password

#### Workflow
1. Clic sur "Reset password"
2. Modal confirmation simple
3. Option message personnalisé
4. Envoi email avec lien
5. Notification succès
6. Log dans audit trail

#### Composant ResetPasswordModal.tsx
```typescript
interface ResetPasswordForm {
  sendEmail: boolean;
  customMessage?: string;
}

// Features:
- Preview email
- Template par défaut
- Personnalisation message
```

## Gestion commune des actions

### Hook useUserActions.ts
```typescript
export const useUserActions = (userId: string) => {
  const queryClient = useQueryClient();
  
  const modifyRights = useMutation({
    mutationFn: (data) => usersApi.modifyRights(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
      message.success('Droits modifiés avec succès');
    },
    onError: (error) => {
      message.error(error.message || 'Erreur lors de la modification');
    }
  });
  
  // Similar pour autres actions...
  
  return {
    modifyRights,
    addCredits,
    suspendUser,
    resetPassword
  };
};
```

### Gestion des erreurs
```typescript
// Erreurs communes:
- 403: "Vous ne pouvez pas retirer vos propres droits admin"
- 400: "Il doit rester au moins un administrateur"
- 404: "Utilisateur non trouvé"
- 500: "Erreur serveur, veuillez réessayer"

// Affichage:
- Message d'erreur dans notification
- Détails dans console pour debug
- Bouton "Réessayer" si pertinent
```

### Optimistic Updates
```typescript
// Exemple pour suspension:
onMutate: async (data) => {
  // Cancel queries
  await queryClient.cancelQueries(['user', userId]);
  
  // Snapshot
  const previous = queryClient.getQueryData(['user', userId]);
  
  // Optimistic update
  queryClient.setQueryData(['user', userId], old => ({
    ...old,
    status: data.action === 'suspend' ? 'suspended' : 'active'
  }));
  
  return { previous };
},
onError: (err, data, context) => {
  // Rollback
  queryClient.setQueryData(['user', userId], context.previous);
}
```

## Confirmations et sécurité

### Niveaux de confirmation
1. **Simple** : Reset password
2. **Moyenne** : Ajouter crédits
3. **Élevée** : Suspendre compte
4. **Critique** : Retirer droits admin

### Messages de confirmation
```typescript
const confirmMessages = {
  rights: {
    title: "Modifier les droits administrateur",
    content: "Êtes-vous sûr de vouloir retirer les droits admin ?",
    okText: "Retirer les droits",
    okType: "danger"
  },
  suspend: {
    title: "Suspendre le compte",
    content: "L'utilisateur ne pourra plus se connecter.",
    okText: "Suspendre",
    okType: "danger"
  }
  // etc...
};
```

## Audit et traçabilité

### Informations loggées
- Action effectuée
- Admin ayant effectué l'action
- Timestamp précis
- Anciennes/nouvelles valeurs
- Raison si fournie
- IP de l'admin

### Affichage dans l'UI
- Badge "NEW" sur actions récentes
- Timeline dans l'onglet historique
- Filtres par type d'action
- Export CSV des logs

## Tests

### Tests unitaires
- Validation des formulaires
- Gestion des erreurs
- Optimistic updates
- Permissions

### Tests E2E
- Parcours complet par action
- Cas d'erreur réseau
- Rollback optimistic
- Notifications 