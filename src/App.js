import React, { useState, useMemo, useCallback } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { ReadOutlined, CalculatorOutlined, TranslationOutlined, HomeOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import EnglishPage from './pages/English';
import MathPage from './pages/Math';
import ChinesePage from './pages/Chinese';
import HomePage from './pages/Home';
import { MENU_ITEMS } from './constants';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  const [selectedKey, setSelectedKey] = useState('home');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = useMemo(() => {
    const iconMap = {
      HomeOutlined: <HomeOutlined />,
      TranslationOutlined: <TranslationOutlined />,
      CalculatorOutlined: <CalculatorOutlined />,
      ReadOutlined: <ReadOutlined />,
    };

    return MENU_ITEMS.map(item => ({
      ...item,
      icon: iconMap[item.icon],
    }));
  }, []);

  const handleMenuClick = useCallback(({ key }) => {
    setSelectedKey(key);
  }, []);

  const handleNavigate = useCallback((key) => {
    setSelectedKey(key);
  }, []);

  const renderContent = useCallback(() => {
    switch (selectedKey) {
      case 'english':
        return <EnglishPage />;
      case 'math':
        return <MathPage />;
      case 'chinese':
        return <ChinesePage />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  }, [selectedKey, handleNavigate]);

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo">
            {!collapsed && <span>ZZ Study</span>}
            {collapsed && <span>ZZ</span>}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <Header className="app-header">
            <Title level={3} style={{ margin: 0, color: '#fff' }}>
              壮壮的学习乐园
            </Title>
          </Header>
          <Content className="app-content">
            {renderContent()}
          </Content>
          <Footer className="app-footer">
            ZZ Study - Made with love for Zhuangzhuang
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
