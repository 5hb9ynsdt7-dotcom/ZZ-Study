import React, { useState, useCallback } from 'react';
import { Card, Button, Typography, Row, Col, Tabs, Tag, message } from 'antd';
import { SoundOutlined, ReadOutlined } from '@ant-design/icons';
import pinyinData, { categoryNames } from '../../data/pinyin';
import './style.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ChinesePage = () => {
  const [selectedPinyin, setSelectedPinyin] = useState(null);

  // 朗读拼音（使用 Web Speech API）
  // 传入汉字时直接朗读汉字，传入拼音时查找对应汉字朗读
  const speakPinyin = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // 检查是否为汉字（直接朗读）
      const isChineseChar = /[\u4e00-\u9fa5]/.test(text);
      let textToSpeak = text;

      // 如果是纯拼音，查找对应的汉字
      if (!isChineseChar) {
        // 遍历所有分类查找对应的汉字
        for (const category of Object.keys(pinyinData)) {
          const item = pinyinData[category].find(p => p.pinyin === text);
          if (item && item.words && item.words.length > 0) {
            textToSpeak = item.words[0]; // 使用第一个例字发音
            break;
          }
        }
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.6;
      window.speechSynthesis.speak(utterance);
    } else {
      message.warning('您的浏览器不支持语音功能');
    }
  }, []);

  // 渲染拼音卡片
  const renderPinyinCard = (item, index) => (
    <Col xs={12} sm={8} md={6} lg={4} key={index}>
      <Card
        hoverable
        className={`pinyin-card ${selectedPinyin === item.pinyin ? 'selected' : ''}`}
        onClick={() => {
          setSelectedPinyin(item.pinyin);
          speakPinyin(item.pinyin);
        }}
      >
        <div className="pinyin-main">{item.pinyin}</div>
        <Button
          type="text"
          icon={<SoundOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            speakPinyin(item.pinyin);
          }}
          className="sound-btn"
        />
      </Card>
    </Col>
  );

  // 渲染拼音详情
  const renderPinyinDetail = (category) => {
    const items = pinyinData[category];
    const selected = items.find(item => item.pinyin === selectedPinyin);

    if (!selected) return null;

    return (
      <Card className="pinyin-detail" title={`${selected.pinyin} 详情`}>
        <div className="detail-content">
          <div className="detail-pinyin">{selected.pinyin}</div>
          <Button
            type="primary"
            size="large"
            icon={<SoundOutlined />}
            onClick={() => speakPinyin(selected.pinyin)}
            style={{ marginBottom: 16 }}
          >
            播放发音
          </Button>
          <div className="detail-example">
            <Text strong>例字例词：</Text>
            <Text>{selected.example}</Text>
          </div>
          <div className="detail-words">
            <Text strong>常用字：</Text>
            <div className="word-tags">
              {selected.words.map((word, idx) => (
                <Tag
                  key={idx}
                  color="blue"
                  className="word-tag"
                  onClick={() => speakPinyin(word)}
                >
                  {word}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 渲染分类内容
  const renderCategory = (category) => {
    const items = pinyinData[category];
    return (
      <div className="category-content">
        <Row gutter={[16, 16]}>
          {items.map((item, index) => renderPinyinCard(item, index))}
        </Row>
        {selectedPinyin && items.some(item => item.pinyin === selectedPinyin) && (
          <div style={{ marginTop: 24 }}>
            {renderPinyinDetail(category)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chinese-page">
      <div className="page-header">
        <Title level={2}>
          <ReadOutlined /> 拼音学习
        </Title>
        <Text type="secondary">点击拼音卡片听发音，学习拼音</Text>
      </div>

      <Tabs
        defaultActiveKey="shengmu"
        type="card"
        size="large"
        onChange={() => setSelectedPinyin(null)}
      >
        {Object.keys(pinyinData).map(category => (
          <TabPane tab={categoryNames[category]} key={category}>
            {renderCategory(category)}
          </TabPane>
        ))}
      </Tabs>

      <Card style={{ marginTop: 24 }} title="拼音表总览">
        <div className="pinyin-overview">
          <div className="overview-section">
            <Title level={5}>声母 (23个)</Title>
            <div className="overview-items">
              {pinyinData.shengmu.map((item, idx) => (
                <span
                  key={idx}
                  className="overview-item"
                  onClick={() => speakPinyin(item.pinyin)}
                >
                  {item.pinyin}
                </span>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <Title level={5}>单韵母 (6个)</Title>
            <div className="overview-items">
              {pinyinData.danyunmu.map((item, idx) => (
                <span
                  key={idx}
                  className="overview-item vowel"
                  onClick={() => speakPinyin(item.pinyin)}
                >
                  {item.pinyin}
                </span>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <Title level={5}>复韵母 (9个)</Title>
            <div className="overview-items">
              {pinyinData.fuyunmu.map((item, idx) => (
                <span
                  key={idx}
                  className="overview-item vowel"
                  onClick={() => speakPinyin(item.pinyin)}
                >
                  {item.pinyin}
                </span>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <Title level={5}>前鼻韵母 (5个)</Title>
            <div className="overview-items">
              {pinyinData.qianbi.map((item, idx) => (
                <span
                  key={idx}
                  className="overview-item vowel"
                  onClick={() => speakPinyin(item.pinyin)}
                >
                  {item.pinyin}
                </span>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <Title level={5}>后鼻韵母 (4个)</Title>
            <div className="overview-items">
              {pinyinData.houbi.map((item, idx) => (
                <span
                  key={idx}
                  className="overview-item vowel"
                  onClick={() => speakPinyin(item.pinyin)}
                >
                  {item.pinyin}
                </span>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <Title level={5}>整体认读音节 (16个)</Title>
            <div className="overview-items">
              {pinyinData.zhengtirend.map((item, idx) => (
                <span
                  key={idx}
                  className="overview-item special"
                  onClick={() => speakPinyin(item.pinyin)}
                >
                  {item.pinyin}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChinesePage;
