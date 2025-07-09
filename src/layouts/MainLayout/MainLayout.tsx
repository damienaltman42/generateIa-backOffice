import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Input, Switch, Drawer, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '../../features/auth/hooks/useAuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const { user, logout } = useAuthContext();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  // const isTablet = useMediaQuery('(max-width: 1024px)'); // Pour usage futur

  // Charger les préférences utilisateur
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar_collapsed');
    if (savedCollapsed && !isMobile) {
      setCollapsed(savedCollapsed === 'true');
    }
  }, [isMobile]);

  // Sauvegarder l'état de la sidebar
  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem('sidebar_collapsed', value.toString());
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tableau de bord',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Utilisateurs',
    },
    {
      key: '/whitelist',
      icon: <UsergroupAddOutlined />,
      label: 'Whitelist',
    },
    {
      key: '/plans-subscriptions',
      icon: <ShoppingOutlined />,
      label: 'Plans & Abonnements',
      children: [
        {
          key: '/plans',
          label: 'Plans',
        },
        {
          key: '/subscriptions',
          label: 'Abonnements',
        },
      ],
    },
    {
      key: '/jobs',
      icon: <ScheduleOutlined />,
      label: 'Jobs',
    },
    {
      key: '/audit',
      icon: <FileTextOutlined />,
      label: 'Audit & Logs',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Paramètres',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mon profil',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Préférences',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      onClick: logout,
    },
  ];

  const handleSearch = (value: string) => {
    // TODO: Implémenter la recherche globale
    console.log('Recherche:', value);
  };

  const renderSidebar = () => (
    <>
      <div className="logo">
        <img src="/images/sowat.webp" alt="Sowat" />
        {!collapsed && <span className="logo-text">Admin</span>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => {
          navigate(key);
          if (isMobile) {
            setMobileDrawerVisible(false);
          }
        }}
      />
    </>
  );

  return (
    <Layout className="main-layout">
      {/* Sidebar desktop */}
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          onCollapse={handleCollapse}
          className="sidebar-desktop"
        >
          {renderSidebar()}
        </Sider>
      )}

      {/* Drawer mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          className="mobile-drawer"
          width={250}
        >
          {renderSidebar()}
        </Drawer>
      )}

      <Layout>
        <Header className="main-header">
          <div className="header-content">
            <div className="header-left">
              {isMobile ? (
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileDrawerVisible(true)}
                  className="mobile-menu-trigger"
                />
              ) : (
                React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: () => handleCollapse(!collapsed),
                })
              )}
              
              {!isMobile && (
                <Search
                  placeholder="Rechercher..."
                  onSearch={handleSearch}
                  className="header-search"
                  prefix={<SearchOutlined />}
                />
              )}
            </div>

            <div className="header-right">
              <Space size="middle">
                {/* Recherche mobile */}
                {isMobile && (
                  <Button
                    type="text"
                    icon={<SearchOutlined />}
                    onClick={() => {
                      // TODO: Ouvrir modal de recherche mobile
                    }}
                  />
                )}

                {/* Notifications */}
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: '5 nouveaux utilisateurs',
                      },
                      {
                        key: '2',
                        label: '3 jobs en erreur',
                      },
                      {
                        key: '3',
                        label: 'Mise à jour système disponible',
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Badge count={8} size="small">
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      className="header-icon-btn"
                    />
                  </Badge>
                </Dropdown>

                {/* Theme switcher */}
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                  className="theme-switcher"
                />

                {/* User menu */}
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Space className="user-info">
                    <Avatar icon={<UserOutlined />} />
                    {!isMobile && <span>{user?.name || user?.email}</span>}
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>

        <Content className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}; 