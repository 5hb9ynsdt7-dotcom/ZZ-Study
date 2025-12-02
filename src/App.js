import React, { useState } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { ReadOutlined, CalculatorOutlined, TranslationOutlined, HomeOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import EnglishPage from './pages/English';
import MathPage from './pages/Math';
import ChinesePage from './pages/Chinese';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  const [selectedKey, setSelectedKey] = useState('home');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'english',
      icon: <TranslationOutlined />,
      label: '英语',
    },
    {
      key: 'math',
      icon: <CalculatorOutlined />,
      label: '数学',
    },
    {
      key: 'chinese',
      icon: <ReadOutlined />,
      label: '语文',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'english':
        return <EnglishPage />;
      case 'math':
        return <MathPage />;
      case 'chinese':
        return <ChinesePage />;
      case 'home':
      default:
        return <HomePage onNavigate={setSelectedKey} />;
    }
  };

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
            onClick={({ key }) => setSelectedKey(key)}
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

const HomePage = ({ onNavigate }) => {
  const subjects = [
    {
      key: 'english',
      title: '英语',
      icon: '🔤',
      description: '自然拼读单词听写',
      color: '#1890ff',
    },
    {
      key: 'math',
      title: '数学',
      icon: '🔢',
      description: '100以内加减法练习',
      color: '#52c41a',
    },
    {
      key: 'chinese',
      title: '语文',
      icon: '📖',
      description: '拼音学习',
      color: '#fa8c16',
    },
  ];

  return (
    <div className="home-page">
      <div className="welcome-section">
        <div className="welcome-icon">👋</div>
        <Title level={1}>欢迎来到学习乐园！</Title>
        <p className="welcome-text">壮壮，今天想学什么呢？</p>
      </div>

      <div className="subject-grid">
        {subjects.map(subject => (
          <div
            key={subject.key}
            className="subject-card"
            onClick={() => onNavigate(subject.key)}
            style={{ borderColor: subject.color }}
          >
            <div className="subject-icon">{subject.icon}</div>
            <div className="subject-title" style={{ color: subject.color }}>
              {subject.title}
            </div>
            <div className="subject-desc">{subject.description}</div>
          </div>
        ))}
      </div>

      <div className="tips-section">
        <Title level={4}>学习小贴士</Title>
        <ul>
          <li>每天坚持学习，进步更快哦！</li>
          <li>遇到不会的，多听几遍就会啦！</li>
          <li>答错也没关系，我们一起来改正！</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
