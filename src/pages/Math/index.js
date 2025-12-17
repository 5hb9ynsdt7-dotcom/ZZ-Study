import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Input, Progress, message, Space, Typography, Row, Col, Statistic, Radio } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, TrophyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { DIFFICULTY_CONFIG, QUESTION_COUNTS, SCORE_THRESHOLDS } from '../../constants';
import './style.css';

const { Title, Text } = Typography;

const MathPage = () => {
  const [mode, setMode] = useState('menu'); // menu, practice, result
  const [difficulty, setDifficulty] = useState('easy'); // easy, medium, hard
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(20);

  // 生成算术题
  const generateQuestion = useCallback((diff) => {
    const max = DIFFICULTY_CONFIG[diff]?.max || 100;
    let num1 = Math.floor(Math.random() * max) + 1;
    let num2 = Math.floor(Math.random() * max) + 1;
    const operator = Math.random() > 0.5 ? '+' : '-';
    
    // 确保减法结果非负
    if (operator === '-' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }
    
    const answer = operator === '+' ? num1 + num2 : num1 - num2;
    return { num1, num2, operator, answer };
  }, []);

  // 生成所有题目
  const generateQuestions = useCallback((count, diff) => {
    const qs = [];
    for (let i = 0; i < count; i++) {
      qs.push(generateQuestion(diff));
    }
    return qs;
  }, [generateQuestion]);

  // 开始练习
  const startPractice = () => {
    const qs = generateQuestions(totalQuestions, difficulty);
    setQuestions(qs);
    setMode('practice');
    setCurrentIndex(0);
    setAnswers([]);
    setUserInput('');
    setShowAnswer(false);
  };

  // 当前题目
  const currentQuestion = questions[currentIndex];

  // 提交答案
  const submitAnswer = () => {
    const userAnswer = parseInt(userInput, 10);
    const isCorrect = userAnswer === currentQuestion.answer;

    setAnswers([...answers, {
      question: `${currentQuestion.num1} ${currentQuestion.operator} ${currentQuestion.num2}`,
      userAnswer: userInput,
      correctAnswer: currentQuestion.answer,
      isCorrect,
    }]);

    setShowAnswer(true);

    if (isCorrect) {
      message.success('回答正确！');
    } else {
      message.error('答案错误！');
    }
  };

  // 下一题
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setShowAnswer(false);
    } else {
      setMode('result');
    }
  };

  // 计算得分
  const getScore = () => {
    const correct = answers.filter(a => a.isCorrect).length;
    return {
      correct,
      total: answers.length,
      percentage: Math.round((correct / answers.length) * 100),
    };
  };


  // 渲染菜单
  const renderMenu = () => (
    <div className="math-menu">
      <Title level={2}>数学练习</Title>
      <Text type="secondary">100以内加减法练习</Text>

      <Card style={{ marginTop: 24 }} title="选择难度">
        <Radio.Group
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          size="large"
          buttonStyle="solid"
        >
          {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
            <Radio.Button key={key} value={key}>
              <span style={{ color: config.color }}>
                {config.label}
              </span>
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>

      <Card style={{ marginTop: 16 }} title="题目数量">
        <Radio.Group
          value={totalQuestions}
          onChange={(e) => setTotalQuestions(e.target.value)}
          size="large"
        >
          {QUESTION_COUNTS.map(count => (
            <Radio.Button key={count} value={count}>
              {count}题
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>

      <Button
        type="primary"
        size="large"
        icon={<PlayCircleOutlined />}
        onClick={startPractice}
        style={{ marginTop: 24, height: 60, fontSize: 20 }}
      >
        开始练习
      </Button>
    </div>
  );

  // 渲染练习界面
  const renderPractice = () => (
    <div className="math-practice">
      <div className="practice-header">
        <Button onClick={() => setMode('menu')}>返回</Button>
        <Progress
          percent={Math.round(((currentIndex + 1) / questions.length) * 100)}
          format={() => `${currentIndex + 1}/${questions.length}`}
          style={{ width: 200 }}
        />
      </div>

      <Card className="practice-card">
        <div className="question-area">
          <div className="math-question">
            <span className="number">{currentQuestion?.num1}</span>
            <span className="operator">{currentQuestion?.operator}</span>
            <span className="number">{currentQuestion?.num2}</span>
            <span className="equals">=</span>
            <Input
              className="answer-input"
              type="number"
              size="large"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onPressEnter={!showAnswer ? submitAnswer : nextQuestion}
              disabled={showAnswer}
              autoFocus
            />
          </div>

          {!showAnswer ? (
            <Button
              type="primary"
              size="large"
              onClick={submitAnswer}
              disabled={userInput === ''}
              style={{ marginTop: 24 }}
            >
              提交答案
            </Button>
          ) : (
            <div className="answer-feedback">
              <div className={`feedback-icon ${answers[answers.length - 1]?.isCorrect ? 'correct' : 'wrong'}`}>
                {answers[answers.length - 1]?.isCorrect ?
                  <CheckCircleOutlined /> : <CloseCircleOutlined />}
              </div>

              {!answers[answers.length - 1]?.isCorrect && (
                <div className="correct-answer">
                  <Text>正确答案是：</Text>
                  <Text strong style={{ fontSize: 32, color: '#52c41a' }}>
                    {currentQuestion.answer}
                  </Text>
                </div>
              )}

              <Button
                type="primary"
                size="large"
                onClick={nextQuestion}
                style={{ marginTop: 16 }}
              >
                {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  // 渲染结果界面
  const renderResult = () => {
    const score = getScore();
    return (
      <div className="math-result">
        <Card className="result-card">
          <div className="result-header">
            <TrophyOutlined className="trophy-icon" />
            <Title level={2}>练习完成！</Title>
          </div>

          <Row gutter={16} justify="center">
            <Col>
              <Statistic
                title="正确数"
                value={score.correct}
                suffix={`/ ${score.total}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col>
              <Statistic
                title="正确率"
                value={score.percentage}
                suffix="%"
                valueStyle={{ color: score.percentage >= 80 ? '#52c41a' : '#faad14' }}
              />
            </Col>
          </Row>

          <div className="result-message">
            {score.percentage >= SCORE_THRESHOLDS.EXCELLENT ? (
              <Text type="success" style={{ fontSize: 18 }}>太棒了！你是数学小天才！</Text>
            ) : score.percentage >= SCORE_THRESHOLDS.GOOD ? (
              <Text style={{ fontSize: 18, color: '#faad14' }}>不错哦！继续加油！</Text>
            ) : (
              <Text type="secondary" style={{ fontSize: 18 }}>多多练习，你会更棒的！</Text>
            )}
          </div>

          <div className="answer-list">
            <Title level={4}>答题详情</Title>
            {answers.map((item, idx) => (
              <div key={idx} className={`answer-item ${item.isCorrect ? 'correct' : 'wrong'}`}>
                <span className="answer-icon">
                  {item.isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </span>
                <span className="answer-question">{item.question} = </span>
                <span className="answer-user">{item.userAnswer}</span>
                {!item.isCorrect && (
                  <span className="answer-correct">（正确: {item.correctAnswer}）</span>
                )}
              </div>
            ))}
          </div>

          <Space style={{ marginTop: 24 }}>
            <Button type="primary" icon={<ReloadOutlined />} onClick={startPractice}>
              再来一次
            </Button>
            <Button onClick={() => setMode('menu')}>
              返回菜单
            </Button>
          </Space>
        </Card>
      </div>
    );
  };

  return (
    <div className="math-page">
      {mode === 'menu' && renderMenu()}
      {mode === 'practice' && renderPractice()}
      {mode === 'result' && renderResult()}
    </div>
  );
};

export default MathPage;
