# Sowat.io Admin Backoffice

Interface d'administration pour la plateforme Sowat.io permettant la gestion des utilisateurs, plans, abonnements, jobs et monitoring.

## 🚀 Stack Technique

- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 5
- **Charts**: @ant-design/charts
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS Modules + Ant Design
- **Linting**: ESLint + Prettier
- **Date**: Day.js

## 📁 Structure du Projet

```
src/
├── config/              # Configuration globale (constantes, env)
├── features/            # Modules par fonctionnalité
│   ├── auth/           # Authentification et login
│   ├── dashboard/      # Dashboard et KPIs
│   ├── users/          # Gestion des utilisateurs
│   ├── plans/          # Gestion des plans
│   ├── jobs/           # Monitoring des jobs
│   ├── subscriptions/  # Gestion des abonnements
│   └── audit/          # Audit trail
├── layouts/            # Layouts de l'application
├── shared/             # Code partagé
│   ├── api/           # Client API et intercepteurs
│   ├── components/    # Composants réutilisables
│   ├── hooks/         # Hooks custom
│   ├── types/         # Types TypeScript globaux
│   └── utils/         # Fonctions utilitaires
└── App.tsx            # Point d'entrée de l'application
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour la production
npm run build

# Lancer les tests
npm test

# Linter le code
npm run lint

# Formater le code
npm run format
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
VITE_API_URL=http://localhost:3000
```

### Ports

- Frontend Admin: http://localhost:5174
- Backend API: http://localhost:3000

## 🏗️ Architecture

### Structure par Features

Chaque feature contient :
- `components/` : Composants spécifiques à la feature
- `hooks/` : Hooks custom de la feature
- `api/` : Appels API de la feature
- `types/` : Types TypeScript de la feature
- `utils/` : Utilitaires spécifiques
- `index.tsx` : Point d'entrée de la feature

### Conventions de Code

- **Composants**: PascalCase (`UserList.tsx`)
- **Hooks**: camelCase avec préfixe `use` (`useUserList.ts`)
- **Types**: PascalCase avec suffixe si nécessaire (`UserListProps`)
- **Constantes**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Fonctions**: camelCase (`getUserById`)

### Gestion de l'État

- **Server State**: React Query pour les données serveur
- **Local State**: useState/useReducer pour l'état local
- **Global State**: Context API pour l'état global (auth, theme)

### Gestion des Erreurs

- Intercepteur Axios global pour les erreurs API
- Composants Error Boundary pour les erreurs React
- Messages d'erreur via Ant Design Message

## 🔐 Sécurité

- Authentification JWT avec refresh token
- Protection des routes admin
- Stockage sécurisé des tokens
- CORS configuré pour le domaine admin

## 📝 Scripts NPM

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
  "type-check": "tsc --noEmit"
}
```

## 🧪 Tests

Les tests seront ajoutés dans la phase suivante avec :
- Jest pour les tests unitaires
- React Testing Library pour les tests de composants
- Cypress pour les tests E2E

## 🚢 Déploiement

Le build de production génère des fichiers statiques dans le dossier `dist/` qui peuvent être déployés sur n'importe quel serveur web statique.

```bash
npm run build
# Les fichiers sont dans dist/
```

## 👥 Contribution

1. Créer une branche feature : `git checkout -b feature/ma-feature`
2. Commiter les changements : `git commit -m 'Add ma feature'`
3. Pousser la branche : `git push origin feature/ma-feature`
4. Créer une Pull Request

## 📄 License

Propriétaire - Sowat.io © 2024
