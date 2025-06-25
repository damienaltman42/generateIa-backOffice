# Phase 5 - Tâche 3 : Layout général - COMPLÉTÉ

## Vue d'ensemble
Le layout général du backoffice a été implémenté avec une navigation claire, responsive et accessible.

## Implémentations réalisées

### 1. Structure du layout

#### MainLayout Component
- **Sidebar rétractable** : Peut être pliée/dépliée avec sauvegarde de la préférence
- **Header fixe** : Reste visible lors du scroll
- **Zone de contenu** : Avec padding adaptatif selon l'écran

### 2. Fonctionnalités du header

- **Bouton toggle** : Pour plier/déplier la sidebar (desktop)
- **Recherche globale** : Barre de recherche (desktop uniquement)
- **Notifications** : Badge avec dropdown des notifications récentes
- **Switch thème** : Bascule entre mode clair/sombre
- **Menu utilisateur** : Avatar avec dropdown (profil, préférences, déconnexion)

### 3. Navigation

#### Structure des menus
- Tableau de bord
- Utilisateurs
- Plans & Abonnements (sous-menu)
  - Plans
  - Abonnements
- Jobs
- Audit & Logs
- Paramètres

#### Comportement
- Sélection automatique selon l'URL
- Navigation fluide avec React Router
- Fermeture automatique du drawer mobile après navigation

### 4. Responsive design

#### Desktop (> 768px)
- Sidebar fixe à gauche
- Header complet avec recherche
- Contenu centré avec padding

#### Mobile (≤ 768px)
- Menu hamburger ouvrant un drawer
- Header simplifié sans recherche
- Bouton de recherche séparé
- Padding réduit

### 5. Mode sombre/clair

#### Implémentation
- Hook `useTheme` pour gérer l'état
- Sauvegarde de la préférence dans localStorage
- Application du thème Ant Design
- Classes CSS pour styles personnalisés

#### Styles adaptés
- Couleurs de fond
- Couleurs de texte
- Bordures et ombres
- Composants Ant Design

### 6. Préférences utilisateur

- **État de la sidebar** : Sauvegardé dans localStorage
- **Thème** : Sauvegardé dans localStorage
- **Persistance** : Les préférences sont restaurées au rechargement

### 7. Hooks utilitaires

#### useTheme
```typescript
{
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeConfig: Algorithm;
}
```

#### useMediaQuery
```typescript
useMediaQuery(query: string): boolean
```

### 8. Accessibilité

- Navigation au clavier fonctionnelle
- Aria labels sur les boutons d'action
- Contraste suffisant en mode clair et sombre
- Structure sémantique HTML

## État actuel

✅ Layout responsive complet
✅ Sidebar rétractable avec sauvegarde
✅ Mode sombre/clair fonctionnel
✅ Header avec recherche et notifications
✅ Navigation mobile optimisée
✅ Préférences utilisateur persistantes

## TODO pour compléter

1. Implémenter la recherche globale réelle
2. Connecter les notifications à une API
3. Ajouter des animations de transition
4. Implémenter les pages manquantes
5. Ajouter des tests d'accessibilité
6. Optimiser les performances sur mobile

## Structure des fichiers

```
src/
├── layouts/
│   └── MainLayout/
│       ├── MainLayout.tsx
│       ├── MainLayout.css
│       └── index.ts
├── hooks/
│   ├── useTheme.ts
│   └── useMediaQuery.ts
└── pages/
    └── Dashboard/
        └── DashboardPage.tsx
```

## Comment tester

1. **Desktop** : Vérifier la sidebar rétractable et tous les éléments du header
2. **Mobile** : Tester le drawer et la navigation tactile
3. **Thème** : Basculer entre clair/sombre et vérifier la persistance
4. **Préférences** : Plier la sidebar et recharger la page
5. **Responsive** : Redimensionner la fenêtre pour tester les breakpoints

## Notes techniques

- Utilisation des composants Layout d'Ant Design
- Breakpoint mobile : 768px
- Les préférences sont stockées dans localStorage
- Le thème utilise l'algorithme d'Ant Design pour une cohérence totale 