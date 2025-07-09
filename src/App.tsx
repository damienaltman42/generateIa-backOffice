import { ConfigProvider, App as AntdApp, message, notification } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import frFR from 'antd/locale/fr_FR'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import './App.css'

// Import auth components
import { AuthProvider, LoginPage, ForgotPasswordPage, PrivateRoute } from './features/auth'
import { MainLayout } from './layouts/MainLayout/MainLayout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import { UsersListPage, UserDetailPage } from './features/users'
import { PlansListPage, PlanFormPage } from './features/plans'
import { WhitelistManagementPage } from './features/whitelist'
import { useTheme } from './hooks/useTheme'

// Set dayjs locale
dayjs.locale('fr')

// Configuration globale des notifications
notification.config({
  placement: 'topRight',
  duration: 4,
});

message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function AppContent() {
  const { themeConfig } = useTheme();
  
  return (
    <ConfigProvider
      locale={frFR}
      theme={{
        algorithm: themeConfig,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontSize: 25,
        },
        components: {
          Button: {
            fontSize:18,
          },
          Input: {
            fontSize:18,
          },
          Select: {
            fontSize:18,
          },
          Table: {
            fontSize:18,
          },
          Menu: {
            fontSize:18,
          },
          Tabs: {
            fontSize:18,
          },
          Card: {
            fontSize:18,
          },
          Modal: {
            fontSize:18,
          },
          Form: {
            fontSize:18,
          },
          Typography: {
            fontSize:18,
          },
        },
      }}
    >
      <AntdApp
        message={{ maxCount: 3 }}
        notification={{ placement: 'topRight' }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
            <Route path="plans" element={<PlansListPage />} />
            <Route path="plans/new" element={<PlanFormPage />} />
            <Route path="plans/:id/edit" element={<PlanFormPage />} />
            <Route path="whitelist" element={<WhitelistManagementPage />} />
            {/* Les autres routes seront ajoutées ici */}
          </Route>
          
          {/* Redirect any unknown route to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
