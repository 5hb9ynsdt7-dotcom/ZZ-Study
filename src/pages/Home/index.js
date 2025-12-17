import React from 'react';
import { Typography } from 'antd';
import './style.css';

const { Title } = Typography;

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

export default HomePage;
