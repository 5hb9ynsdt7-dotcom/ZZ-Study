import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Button, Progress, message, Typography, Row, Col, Statistic, Space, Tag } from 'antd';
import { SoundOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, TrophyOutlined, EditOutlined, AudioOutlined, BookOutlined, QuestionCircleOutlined, CustomerServiceOutlined, EyeOutlined } from '@ant-design/icons';
import wordsData from '../../data/words';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { CATEGORY_INFO, SPEECH_CONFIG, SCORE_THRESHOLDS } from '../../constants';
import './style.css';

const { Title, Text } = Typography;

const vowels = ['a', 'e', 'i', 'o', 'u'];

const EnglishPage = () => {
  const [mode, setMode] = useState('menu');
  const [practiceType, setPracticeType] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [practiceWords, setPracticeWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [options, setOptions] = useState([]);
  const [voices, setVoices] = useState([]);
  const [blankInfo, setBlankInfo] = useState(null);
  const [longWordStage, setLongWordStage] = useState(1);
  const [longWordData, setLongWordData] = useState({ teaching: [], decoding: [], combination: [] });
  const [selectedModules, setSelectedModules] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  // Irregular words practice
  const [irregularStage, setIrregularStage] = useState(1);
  const [irregularData, setIrregularData] = useState({ words: [], matching: [], fillBlank: [], puzzles: [] });
  const [matchingPairs, setMatchingPairs] = useState([]);
  const [matchingSelected, setMatchingSelected] = useState({ left: null, right: null });
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [fillBlankAnswer, setFillBlankAnswer] = useState(null);
  const [puzzleInput, setPuzzleInput] = useState('');
  // Read-along practice
  const [readAlongSentences, setReadAlongSentences] = useState([]);
  const [readAlongShowText, setReadAlongShowText] = useState(false);
  
  const { speak, speakSequentially, voicesLoaded } = useSpeechSynthesis('en-US');

  const speakWord = useCallback((text, rate = 0.75) => {
    speak(text, {
      rate,
      preferredVoices: SPEECH_CONFIG.ENGLISH.preferredVoices,
    });
  }, [speak]);

  const speakSyllables = useCallback((syllables, word) => {
    const parts = syllables.split('-');
    const texts = [...parts, word];
    speakSequentially(texts, {
      delay: 600,
      rate: 0.5,
      preferredVoices: SPEECH_CONFIG.ENGLISH.preferredVoices,
    });
  }, [speakSequentially]);

  const generateOptions = useCallback((correctWord, allWords) => {
    const otherWords = allWords.filter(w => w.word !== correctWord.word);
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3);
    const allOptions = [correctWord, ...wrongOptions];
    return allOptions.sort(() => Math.random() - 0.5);
  }, []);

  const generateBlankInfo = useCallback((word) => {
    const wordStr = word.word.toLowerCase();
    const vowelIndices = [];
    for (let i = 0; i < wordStr.length; i++) {
      if (vowels.includes(wordStr[i])) {
        vowelIndices.push(i);
      }
    }
    if (vowelIndices.length === 0) return null;
    const blankIndex = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
    const correctLetter = wordStr[blankIndex];
    const displayWord = wordStr.slice(0, blankIndex) + '_' + wordStr.slice(blankIndex + 1);
    const wrongLetters = vowels.filter(v => v !== correctLetter);
    const shuffledWrong = [...wrongLetters].sort(() => Math.random() - 0.5).slice(0, 2);
    const letterOptions = [correctLetter, ...shuffledWrong].sort(() => Math.random() - 0.5);
    return { displayWord, correctLetter, letterOptions, blankIndex };
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectAllCategories = useCallback(() => {
    setSelectedCategories(Object.keys(CATEGORY_INFO));
  }, []);

  const startPractice = (categories, type) => {
    let words = [];
    categories.forEach(cat => {
      if (wordsData[cat]) {
        words = [...words, ...wordsData[cat]];
      }
    });
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 10);

    setPracticeWords(selectedWords);
    setPracticeType(type);
    setMode('practice');
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowAnswer(false);

    if (type === 'dictation') {
      setOptions(generateOptions(selectedWords[0], words));
    } else {
      setBlankInfo(generateBlankInfo(selectedWords[0]));
    }
  };

  // Helper: get modules from syllables string (e.g., "ad-ven-ture" -> ["ad", "ven", "ture"])
  const getModulesFromWord = (word) => {
    return word.syllables ? word.syllables.split('-') : [word.word];
  };

  const generateCombinationModules = (currentWord, allWords) => {
    const correctModules = getModulesFromWord(currentWord);
    const distractors = ['ing', 'tion', 'ness', 'ful', 'less', 'pre', 'un', 'dis', 'er', 'est', 'ly', 'ment'];

    // Get distractors from other words' modules (derived from syllables)
    allWords.forEach(item => {
      if (item !== currentWord) {
        const itemModules = getModulesFromWord(item);
        itemModules.forEach(m => {
          if (!correctModules.includes(m) && !distractors.includes(m)) {
            distractors.push(m);
          }
        });
      }
    });

    // Shuffle distractors and select some
    const shuffledDistractors = distractors.sort(() => Math.random() - 0.5);
    const numDistractors = Math.max(0, 8 - correctModules.length);
    const selectedDistractors = shuffledDistractors.slice(0, numDistractors);

    // Combine correct modules with distractors and shuffle
    const allModules = [...correctModules, ...selectedDistractors];
    return allModules.sort(() => Math.random() - 0.5).slice(0, 8);
  };

  const startLongWordPractice = () => {
    // Shuffle unified word pool and pick unique words for each stage
    const shuffled = [...wordsData.long_words].sort(() => Math.random() - 0.5);
    const teaching = shuffled.slice(0, 3);
    const decoding = shuffled.slice(3, 8);
    const combination = shuffled.slice(8, 13);

    setLongWordData({ teaching, decoding, combination });
    setLongWordStage(1);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedModules([]);
    setPracticeType('longword');
    setMode('practice');

    if (combination.length > 0) {
      const modules = generateCombinationModules(combination[0], combination);
      setAvailableModules(modules);
    }
  };

  const currentWord = practiceWords[currentIndex];

  useEffect(() => {
    if (mode === 'practice' && currentWord && practiceWords.length > 0 && practiceType !== 'longword') {
      if (practiceType === 'dictation') {
        let allWords = [];
        selectedCategories.forEach(cat => {
          if (wordsData[cat]) allWords = [...allWords, ...wordsData[cat]];
        });
        if (allWords.length === 0) {
          Object.values(wordsData).forEach(arr => { if (Array.isArray(arr)) allWords = [...allWords, ...arr]; });
        }
        setOptions(generateOptions(currentWord, allWords));
      } else if (practiceType === 'fillblank') {
        setBlankInfo(generateBlankInfo(currentWord));
      }
    }
  }, [mode, currentIndex, currentWord, practiceWords, selectedCategories, generateOptions, generateBlankInfo, practiceType]);

  useEffect(() => {
    if (mode === 'practice' && currentWord && !showAnswer && voicesLoaded && practiceType !== 'longword') {
      setTimeout(() => speakWord(currentWord.word), 500);
    }
  }, [mode, currentIndex, currentWord, showAnswer, speakWord, practiceType, voicesLoaded]);

  const selectAnswer = (answer) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);

    if (practiceType === 'dictation') {
      const isCorrect = answer.word === currentWord.word;
      setAnswers([...answers, { word: currentWord.word, meaning: currentWord.meaning, userAnswer: answer.word, isCorrect }]);
      setShowAnswer(true);
      if (isCorrect) message.success('回答正确！太棒了！');
      else message.error('再试试！');
    } else {
      const isCorrect = answer === blankInfo.correctLetter;
      setAnswers([...answers, { word: currentWord.word, meaning: currentWord.meaning, userAnswer: answer, correctAnswer: blankInfo.correctLetter, isCorrect }]);
      setShowAnswer(true);
      if (isCorrect) message.success('回答正确！太棒了！');
      else message.error('再试试！');
    }
  };

  const nextQuestion = () => {
    if (currentIndex < practiceWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setMode('result');
    }
  };

  const replay = useCallback(() => {
    if (currentWord) {
      speakWord(currentWord.word);
    }
  }, [currentWord, speakWord]);

  const phonicsToSound = (part) => {
    const soundMap = {
      'b': 'buh', 'c': 'kuh', 'd': 'duh', 'f': 'fuh', 'g': 'guh',
      'h': 'huh', 'j': 'juh', 'k': 'kuh', 'l': 'luh', 'm': 'muh',
      'n': 'nuh', 'p': 'puh', 'q': 'kwuh', 'r': 'ruh', 's': 'suh',
      't': 'tuh', 'v': 'vuh', 'w': 'wuh', 'x': 'ks', 'y': 'yuh', 'z': 'zuh',
      'a': 'aah', 'e': 'eh', 'i': 'ih', 'o': 'ah', 'u': 'uh',
      'ai': 'ey', 'ay': 'ey', 'ee': 'ee', 'ea': 'ee',
      'oa': 'oh', 'oe': 'oh', 'ow': 'ow', 'ou': 'ow',
      'oo': 'oo', 'oi': 'oy', 'oy': 'oy',
      'au': 'aw', 'aw': 'aw', 'igh': 'eye',
      'ar': 'ar', 'er': 'er', 'ir': 'er', 'ur': 'er', 'or': 'or',
      'th': 'thuh', 'sh': 'shuh', 'ch': 'chuh', 'wh': 'wuh', 'ph': 'fuh',
      'ck': 'kuh', 'ng': 'ng', 'nk': 'nk',
      'bl': 'bluh', 'br': 'bruh', 'cl': 'cluh', 'cr': 'cruh', 'dr': 'druh',
      'fl': 'fluh', 'fr': 'fruh', 'gl': 'gluh', 'gr': 'gruh', 'pl': 'pluh',
      'pr': 'pruh', 'sc': 'scuh', 'sk': 'skuh', 'sl': 'sluh', 'sm': 'smuh',
      'sn': 'snuh', 'sp': 'spuh', 'st': 'stuh', 'sw': 'swuh', 'tr': 'truh',
      'tw': 'twuh', 'kn': 'nuh', 'wr': 'ruh',
      'nt': 'nt', 'nd': 'nd', 'lt': 'lt', 'ld': 'ld', 'ft': 'ft',
    };
    return soundMap[part.toLowerCase()] || part;
  };

  const speakPhonics = useCallback((phonics, word) => {
    const parts = phonics.split('-');
    const sounds = parts.map(part => phonicsToSound(part));
    const texts = [...sounds, word];
    speakSequentially(texts, {
      delay: 700,
      rate: 0.6,
      preferredVoices: SPEECH_CONFIG.ENGLISH.preferredVoices,
    });
  }, [speakSequentially]);

  const getScore = () => {
    const correct = answers.filter(a => a.isCorrect).length;
    return { correct, total: answers.length, percentage: answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0 };
  };

  const handleModuleClick = (module) => {
    if (selectedModules.includes(module)) {
      setSelectedModules(selectedModules.filter(m => m !== module));
    } else {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const checkCombination = () => {
    const currentCombWord = longWordData.combination[currentIndex];
    const userWord = selectedModules.join('');
    const correctWord = currentCombWord.word.toLowerCase();
    const isCorrect = userWord.toLowerCase() === correctWord;

    setAnswers([...answers, {
      word: currentCombWord.word,
      meaning: currentCombWord.meaning,
      userAnswer: selectedModules.join('-'),
      correctAnswer: currentCombWord.syllables,
      isCorrect
    }]);
    setShowAnswer(true);

    if (isCorrect) {
      message.success('拼对了！太棒了！');
    } else {
      message.error('再想想哦！');
    }
  };

  const nextLongWordQuestion = () => {
    if (longWordStage === 1) {
      if (currentIndex < longWordData.teaching.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        setLongWordStage(2);
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } else if (longWordStage === 2) {
      if (currentIndex < longWordData.decoding.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        setLongWordStage(3);
        setCurrentIndex(0);
        setShowAnswer(false);
        setSelectedModules([]);
        // Generate modules for the first combination question
        const modules = generateCombinationModules(longWordData.combination[0], longWordData.combination);
        setAvailableModules(modules);
      }
    } else {
      if (currentIndex < longWordData.combination.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setShowAnswer(false);
        setSelectedModules([]);
        // Generate modules for the next combination question
        const modules = generateCombinationModules(longWordData.combination[nextIndex], longWordData.combination);
        setAvailableModules(modules);
      } else {
        setMode('longword-result');
      }
    }
  };

  const startIrregularPractice = () => {
    // Shuffle unified word pool and pick unique words for each stage
    const shuffled = [...wordsData.irregular_words].sort(() => Math.random() - 0.5);

    // Stage 1: Matching (5 words)
    const matchingWords = shuffled.slice(0, 5);
    const leftItems = matchingWords.map((w, i) => ({ id: i, type: 'word', value: w.word, pairId: i }));
    const rightItems = matchingWords.map((w, i) => ({ id: i + 5, type: 'meaning', value: w.meaning, pairId: i }));
    const shuffledRight = [...rightItems].sort(() => Math.random() - 0.5);

    // Stage 2: Fill-in-the-blank (5 different words, generate from word data)
    const fillWords = shuffled.slice(5, 10);
    const fillSentences = fillWords.map(w => ({
      sentence: w.sentence.replace(new RegExp(w.word, 'gi'), '______'),
      answer: w.word,
      meaning: w.meaning,
      note: w.note,
    }));

    // Stage 3: Puzzles (5 different words, generate scrambled letters)
    const puzzleWords = shuffled.slice(10, 15);
    const puzzles = puzzleWords.map(w => ({
      hint: w.meaning,
      answer: w.word,
      scrambled: w.word.split('').sort(() => Math.random() - 0.5).join(''),
      note: w.note,
    }));

    setIrregularData({
      words: shuffled.slice(0, 15),
      matching: { left: leftItems, right: shuffledRight },
      fillBlank: fillSentences,
      puzzles: puzzles,
    });
    setIrregularStage(1);
    setCurrentIndex(0);
    setMatchingPairs([]);
    setMatchedPairs([]);
    setMatchingSelected({ left: null, right: null });
    setFillBlankAnswer(null);
    setPuzzleInput('');
    setShowAnswer(false);
    setAnswers([]);
    setPracticeType('irregular');
    setMode('practice');
  };

  const startReadAlongPractice = (dayNum = null) => {
    // If no dayNum provided, use today's date
    if (dayNum === null) {
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
      dayNum = (dayOfYear % 14) + 1;
    }

    const todaySentences = wordsData.read_along_sentences.filter(s => s.day === dayNum);

    setReadAlongSentences(todaySentences);
    setCurrentIndex(0);
    setReadAlongShowText(false);
    setAnswers([]);
    setPracticeType('readalong');
    setMode('practice');
  };

  const shuffleReadAlongPractice = () => {
    // Get current day to pick a different one
    const currentDay = readAlongSentences[0]?.day || 1;
    const availableDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].filter(d => d !== currentDay);
    const randomDay = availableDays[Math.floor(Math.random() * availableDays.length)];
    startReadAlongPractice(randomDay);
  };

  const handleMatchingClick = (item, side) => {
    if (matchedPairs.includes(item.pairId)) return;

    if (side === 'left') {
      setMatchingSelected(prev => ({ ...prev, left: item }));
      if (matchingSelected.right) {
        // Check if pair is correct
        if (matchingSelected.right.pairId === item.pairId) {
          setMatchedPairs([...matchedPairs, item.pairId]);
          message.success('配对正确！');
        } else {
          message.error('再试试看！');
        }
        setMatchingSelected({ left: null, right: null });
      }
    } else {
      setMatchingSelected(prev => ({ ...prev, right: item }));
      if (matchingSelected.left) {
        // Check if pair is correct
        if (matchingSelected.left.pairId === item.pairId) {
          setMatchedPairs([...matchedPairs, item.pairId]);
          message.success('配对正确！');
        } else {
          message.error('再试试看！');
        }
        setMatchingSelected({ left: null, right: null });
      }
    }
  };

  const checkFillBlankAnswer = (selected) => {
    const current = irregularData.fillBlank[currentIndex];
    setFillBlankAnswer(selected);
    setShowAnswer(true);
    const isCorrect = selected === current.answer;
    setAnswers([...answers, { question: current.sentence, userAnswer: selected, correctAnswer: current.answer, isCorrect }]);
    if (isCorrect) {
      message.success('正确！');
    } else {
      message.error(`正确答案是：${current.answer}`);
    }
  };

  const checkPuzzleAnswer = () => {
    const current = irregularData.puzzles[currentIndex];
    const isCorrect = puzzleInput.toLowerCase().trim() === current.answer.toLowerCase();
    setShowAnswer(true);
    setAnswers([...answers, { question: current.hint, userAnswer: puzzleInput, correctAnswer: current.answer, isCorrect }]);
    if (isCorrect) {
      message.success('太棒了！');
    } else {
      message.error(`正确答案是：${current.answer}`);
    }
  };

  const nextIrregularQuestion = () => {
    if (irregularStage === 1) {
      // Matching stage - check if all matched
      if (matchedPairs.length >= 5) {
        setIrregularStage(2);
        setCurrentIndex(0);
        setShowAnswer(false);
        setFillBlankAnswer(null);
      }
    } else if (irregularStage === 2) {
      // Fill blank stage
      if (currentIndex < irregularData.fillBlank.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setFillBlankAnswer(null);
      } else {
        setIrregularStage(3);
        setCurrentIndex(0);
        setShowAnswer(false);
        setPuzzleInput('');
      }
    } else {
      // Puzzle stage
      if (currentIndex < irregularData.puzzles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setPuzzleInput('');
      } else {
        setMode('irregular-result');
      }
    }
  };

  const renderMainMenu = () => (
    <div className="english-menu">
      <Title level={2}>英语学习 - 自然拼读</Title>
      <Text type="secondary">选择练习类型</Text>

      <div className="practice-type-grid">
        <Card className="practice-type-card" hoverable onClick={() => setMode('dictation-menu')}>
          <AudioOutlined className="practice-type-icon" style={{ color: '#1890ff' }} />
          <Title level={4}>听写练习</Title>
          <Text type="secondary">听发音，选单词</Text>
        </Card>

        <Card className="practice-type-card" hoverable onClick={() => setMode('fillblank-menu')}>
          <EditOutlined className="practice-type-icon" style={{ color: '#52c41a' }} />
          <Title level={4}>填空练习</Title>
          <Text type="secondary">看单词，填字母</Text>
        </Card>

        <Card className="practice-type-card" hoverable onClick={startLongWordPractice}>
          <BookOutlined className="practice-type-icon" style={{ color: '#fa8c16' }} />
          <Title level={4}>长单词</Title>
          <Text type="secondary">音节拆分练习</Text>
        </Card>

        <Card className="practice-type-card" hoverable onClick={startIrregularPractice}>
          <QuestionCircleOutlined className="practice-type-icon" style={{ color: '#eb2f96' }} />
          <Title level={4}>不规则词</Title>
          <Text type="secondary">高频视觉词练习</Text>
        </Card>

        <Card className="practice-type-card" hoverable onClick={() => startReadAlongPractice()}>
          <CustomerServiceOutlined className="practice-type-icon" style={{ color: '#722ed1' }} />
          <Title level={4}>跟读练习</Title>
          <Text type="secondary">每日10句跟读</Text>
        </Card>
      </div>
    </div>
  );

  const renderCategoryMenu = (type) => (
    <div className="english-menu">
      <div className="category-header">
        <Button onClick={() => setMode('menu')}>返回</Button>
        <Title level={2} style={{ margin: 0 }}>{type === 'dictation' ? '听写练习' : '填空练习'}</Title>
      </div>
      <Text type="secondary">选择要练习的拼读规则</Text>

      <div className="category-grid">
        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
          <div
            key={key}
            className={`category-card ${selectedCategories.includes(key) ? 'selected' : ''}`}
            onClick={() => toggleCategory(key)}
            style={{ borderColor: selectedCategories.includes(key) ? info.color : undefined }}
          >
            <div className="category-name" style={{ color: info.color }}>{info.name}</div>
            <div className="category-example">{info.example}</div>
            <div className="category-count">{wordsData[key]?.length || 0} 个单词</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Space size="large">
          <Button type="primary" size="large" disabled={selectedCategories.length === 0} onClick={() => startPractice(selectedCategories, type)}>
            开始练习 ({selectedCategories.length} 个规则)
          </Button>
          <Button size="large" onClick={() => { selectAllCategories(); startPractice(Object.keys(CATEGORY_INFO), type); }}>
            综合练习 (全部规则)
          </Button>
        </Space>
      </div>
    </div>
  );

  const renderLongWordPractice = () => {
    const stageNames = ['', '音节拆分教学', '解码挑战', '分类填空'];
    const stageData = longWordStage === 1 ? longWordData.teaching : longWordStage === 2 ? longWordData.decoding : longWordData.combination;
    const currentItem = stageData[currentIndex];

    if (!currentItem) return null;

    return (
      <div className="english-practice">
        <div className="practice-header">
          <Button onClick={() => setMode('menu')}>返回</Button>
          <div className="stage-indicator">
            <Tag color={longWordStage === 1 ? 'blue' : 'default'}>1. 音节教学</Tag>
            <Tag color={longWordStage === 2 ? 'green' : 'default'}>2. 解码挑战</Tag>
            <Tag color={longWordStage === 3 ? 'orange' : 'default'}>3. 分类填空</Tag>
          </div>
          <Progress
            percent={Math.round(((currentIndex + 1) / stageData.length) * 100)}
            format={() => `${currentIndex + 1}/${stageData.length}`}
            style={{ width: 120 }}
          />
        </div>

        <Card className="practice-card">
          <div className="question-area">
            <Title level={3} style={{ color: longWordStage === 1 ? '#1890ff' : longWordStage === 2 ? '#52c41a' : '#fa8c16' }}>
              {stageNames[longWordStage]}
            </Title>

            {longWordStage === 1 && (
              <>
                <div className="longword-display">
                  <div className="longword-word">{currentItem.word}</div>
                  <div className="longword-syllables">{currentItem.syllables}</div>
                  <div className="longword-meaning">({currentItem.meaning})</div>
                </div>
                <div className="longword-actions">
                  <Button type="primary" icon={<SoundOutlined />} size="large" onClick={() => speakSyllables(currentItem.syllables, currentItem.word)}>
                    听音节拼读
                  </Button>
                  <Button icon={<SoundOutlined />} size="large" onClick={() => speakWord(currentItem.word, 0.6)}>
                    听完整发音
                  </Button>
                </div>
                <div className="longword-sentence">
                  <Text type="secondary">例句：{currentItem.sentence}</Text>
                </div>
              </>
            )}

            {longWordStage === 2 && (
              <>
                <div className="longword-display">
                  <div className="longword-word">{currentItem.word}</div>
                  <div className="longword-meaning">({currentItem.meaning})</div>
                  {showAnswer && <div className="longword-syllables reveal">{currentItem.syllables}</div>}
                </div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>试着自己拼读这个单词，然后点击下方按钮听正确读音</Text>
                <div className="longword-actions">
                  {!showAnswer ? (
                    <Button type="primary" icon={<SoundOutlined />} size="large" onClick={() => { setShowAnswer(true); speakSyllables(currentItem.syllables, currentItem.word); }}>
                      查看答案并听发音
                    </Button>
                  ) : (
                    <>
                      <Button type="primary" icon={<SoundOutlined />} size="large" onClick={() => speakSyllables(currentItem.syllables, currentItem.word)}>
                        再听一次
                      </Button>
                    </>
                  )}
                </div>
                {showAnswer && (
                  <div className="longword-sentence">
                    <Text type="secondary">例句：{currentItem.sentence}</Text>
                  </div>
                )}
              </>
            )}

            {longWordStage === 3 && (
              <>
                <div className="combination-question">
                  <Text>听发音，用下方音节模块拼出单词：</Text>
                  <Button type="link" icon={<SoundOutlined />} onClick={() => speakWord(currentItem.word, 0.6)} style={{ fontSize: 18 }}>
                    播放发音
                  </Button>
                  <div className="longword-meaning">({currentItem.meaning})</div>
                </div>

                <div className="selected-modules">
                  {selectedModules.length === 0 ? (
                    <span className="placeholder">点击下方音节模块开始拼词</span>
                  ) : (
                    selectedModules.map((m, i) => (
                      <Tag key={i} color="blue" closable onClose={() => handleModuleClick(m)} style={{ fontSize: 18, padding: '8px 16px' }}>
                        {m}
                      </Tag>
                    ))
                  )}
                </div>

                <div className="module-pool">
                  {availableModules.map((module, idx) => (
                    <Button
                      key={idx}
                      className={`module-btn ${selectedModules.includes(module) ? 'selected' : ''}`}
                      onClick={() => handleModuleClick(module)}
                      disabled={showAnswer}
                    >
                      {module}
                    </Button>
                  ))}
                </div>

                {!showAnswer && selectedModules.length > 0 && (
                  <Button type="primary" size="large" onClick={checkCombination} style={{ marginTop: 16 }}>
                    确认提交
                  </Button>
                )}

                {showAnswer && (
                  <div className="combination-result">
                    <div className={`result-badge ${selectedModules.join('').toLowerCase() === currentItem.word.toLowerCase() ? 'correct' : 'wrong'}`}>
                      {selectedModules.join('').toLowerCase() === currentItem.word.toLowerCase() ? (
                        <><CheckCircleOutlined /> 正确！</>
                      ) : (
                        <><CloseCircleOutlined /> 正确答案：{currentItem.syllables}</>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button type="primary" size="large" onClick={nextLongWordQuestion} disabled={longWordStage > 1 && !showAnswer}>
                {longWordStage === 3 && currentIndex === longWordData.combination.length - 1 ? '完成练习' : '下一个'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderDictationPractice = () => (
    <div className="english-practice">
      <div className="practice-header">
        <Button onClick={() => setMode('dictation-menu')}>返回</Button>
        <Progress percent={Math.round(((currentIndex + 1) / practiceWords.length) * 100)} format={() => `${currentIndex + 1}/${practiceWords.length}`} style={{ width: 200 }} />
      </div>

      <Card className="practice-card">
        <div className="question-area">
          <div className="question-title">
            <Title level={4} style={{ display: 'inline', marginRight: 12 }}>听一听，选一选</Title>
            <Button type="link" icon={<SoundOutlined />} onClick={replay} className="inline-play">播放发音</Button>
          </div>

          <Row gutter={[16, 16]} className="options-grid">
            {options.map((option, idx) => {
              let cardClass = 'option-card';
              if (showAnswer) {
                if (option.word === currentWord.word) cardClass += ' correct';
                else if (option.word === selectedAnswer?.word) cardClass += ' wrong';
              } else if (option.word === selectedAnswer?.word) {
                cardClass += ' selected';
              }
              return (
                <Col span={12} key={idx}>
                  <Card className={cardClass} onClick={() => selectAnswer(option)} hoverable={!showAnswer}>
                    <div className="option-word">{option.word}</div>
                    <div className="option-meaning">{option.meaning}</div>
                    {showAnswer && option.word === currentWord.word && <CheckCircleOutlined className="option-icon correct" />}
                    {showAnswer && option.word === selectedAnswer?.word && option.word !== currentWord.word && <CloseCircleOutlined className="option-icon wrong" />}
                  </Card>
                </Col>
              );
            })}
          </Row>

          {showAnswer && (
            <div className="answer-feedback">
              <div className="word-info">
                <p><Text strong>单词：</Text><span className="info-value">{currentWord.word}</span></p>
                <p><Text strong>拼读：</Text><span className="info-value phonics-value">{currentWord.phonics}</span>
                  <Button type="link" icon={<SoundOutlined />} onClick={() => speakPhonics(currentWord.phonics, currentWord.word)} className="phonics-play">听拼读</Button>
                </p>
                <p><Text strong>中文：</Text><span className="info-value">{currentWord.meaning}</span></p>
                <p><Text strong>例句：</Text><span className="info-value">{currentWord.sentence}</span></p>
              </div>
              <Button type="primary" size="large" onClick={nextQuestion}>{currentIndex < practiceWords.length - 1 ? '下一题' : '查看结果'}</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderFillBlankPractice = () => (
    <div className="english-practice">
      <div className="practice-header">
        <Button onClick={() => setMode('fillblank-menu')}>返回</Button>
        <Progress percent={Math.round(((currentIndex + 1) / practiceWords.length) * 100)} format={() => `${currentIndex + 1}/${practiceWords.length}`} style={{ width: 200 }} />
      </div>

      <Card className="practice-card">
        <div className="question-area">
          <div className="question-title">
            <Title level={4} style={{ display: 'inline', marginRight: 12 }}>听一听，填一填</Title>
            <Button type="link" icon={<SoundOutlined />} onClick={replay} className="inline-play">播放发音</Button>
          </div>

          {blankInfo && (
            <>
              <div className="blank-word-display">
                <span className="blank-word">{blankInfo.displayWord}</span>
                <span className="blank-meaning">({currentWord.meaning})</span>
              </div>
              <div className="letter-options">
                {blankInfo.letterOptions.map((letter, idx) => {
                  let btnClass = 'letter-option';
                  if (showAnswer) {
                    if (letter === blankInfo.correctLetter) btnClass += ' correct';
                    else if (letter === selectedAnswer) btnClass += ' wrong';
                  } else if (letter === selectedAnswer) btnClass += ' selected';
                  return (
                    <Button key={idx} className={btnClass} onClick={() => selectAnswer(letter)} disabled={showAnswer} size="large">
                      <span className="letter-label">{String.fromCharCode(65 + idx)}:</span>
                      <span className="letter-value">{letter}</span>
                      {showAnswer && letter === blankInfo.correctLetter && <CheckCircleOutlined className="letter-icon correct" />}
                      {showAnswer && letter === selectedAnswer && letter !== blankInfo.correctLetter && <CloseCircleOutlined className="letter-icon wrong" />}
                    </Button>
                  );
                })}
              </div>
            </>
          )}

          {showAnswer && (
            <div className="answer-feedback">
              <div className="word-info">
                <p><Text strong>单词：</Text><span className="info-value">{currentWord.word}</span></p>
                <p><Text strong>拼读：</Text><span className="info-value phonics-value">{currentWord.phonics}</span>
                  <Button type="link" icon={<SoundOutlined />} onClick={() => speakPhonics(currentWord.phonics, currentWord.word)} className="phonics-play">听拼读</Button>
                </p>
                <p><Text strong>中文：</Text><span className="info-value">{currentWord.meaning}</span></p>
                <p><Text strong>例句：</Text><span className="info-value">{currentWord.sentence}</span></p>
              </div>
              <Button type="primary" size="large" onClick={nextQuestion}>{currentIndex < practiceWords.length - 1 ? '下一题' : '查看结果'}</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderResult = () => {
    const score = getScore();
    return (
      <div className="english-result">
        <Card className="result-card">
          <div className="result-header">
            <TrophyOutlined className="trophy-icon" />
            <Title level={2}>练习完成！</Title>
          </div>
          <Row gutter={16} justify="center">
            <Col><Statistic title="正确数" value={score.correct} suffix={`/ ${score.total}`} valueStyle={{ color: '#52c41a' }} /></Col>
            <Col><Statistic title="正确率" value={score.percentage} suffix="%" valueStyle={{ color: score.percentage >= 80 ? '#52c41a' : '#faad14' }} /></Col>
          </Row>
          <div className="result-message">
            {score.percentage >= SCORE_THRESHOLDS.EXCELLENT ? <Text type="success" style={{ fontSize: 24 }}>太棒了！你是英语小天才！</Text>
              : score.percentage >= SCORE_THRESHOLDS.GOOD ? <Text style={{ fontSize: 24, color: '#faad14' }}>不错哦！继续加油！</Text>
              : <Text type="secondary" style={{ fontSize: 24 }}>多多练习，你会更棒的！</Text>}
          </div>
          <div className="answer-list">
            <Title level={4}>答题详情</Title>
            {answers.map((item, idx) => (
              <div key={idx} className={`answer-item ${item.isCorrect ? 'correct' : 'wrong'}`}>
                <span className="answer-icon">{item.isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}</span>
                <span className="answer-word">{item.word}</span>
                <span className="answer-meaning">({item.meaning})</span>
                {!item.isCorrect && <span className="answer-user">你选了：{item.userAnswer}{item.correctAnswer && <span className="answer-correct"> (正确：{item.correctAnswer})</span>}</span>}
              </div>
            ))}
          </div>
          <Space style={{ marginTop: 24 }}>
            <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={() => startPractice(selectedCategories.length > 0 ? selectedCategories : Object.keys(CATEGORY_INFO), practiceType)}>再来一次</Button>
            <Button size="large" onClick={() => setMode('menu')}>返回菜单</Button>
          </Space>
        </Card>
      </div>
    );
  };

  const renderLongWordResult = () => (
    <div className="english-result">
      <Card className="result-card">
        <div className="result-header">
          <TrophyOutlined className="trophy-icon" />
          <Title level={2}>长单词练习完成！</Title>
        </div>
        <div className="result-message">
          <Text type="success" style={{ fontSize: 24 }}>太棒了！你完成了所有三个阶段的练习！</Text>
        </div>
        <div className="longword-summary">
          <p>音节拆分教学：学习了 {longWordData.teaching.length} 个单词</p>
          <p>解码挑战：挑战了 {longWordData.decoding.length} 个单词</p>
          <p>分类填空：完成了 {longWordData.combination.length} 道拼词题</p>
        </div>
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={startLongWordPractice}>再来一次</Button>
          <Button size="large" onClick={() => setMode('menu')}>返回菜单</Button>
        </Space>
      </Card>
    </div>
  );

  const renderIrregularPractice = () => {
    const stageNames = ['', '配对连线', '选词填空', '趣味字谜'];

    return (
      <div className="english-practice">
        <div className="practice-header">
          <Button onClick={() => setMode('menu')}>返回</Button>
          <div className="stage-indicator">
            {[1, 2, 3].map(s => (
              <Tag key={s} color={s === irregularStage ? 'blue' : s < irregularStage ? 'green' : 'default'}>
                {s < irregularStage ? <CheckCircleOutlined /> : null} {stageNames[s]}
              </Tag>
            ))}
          </div>
        </div>

        <Card className="practice-card">
          <Title level={3}>{stageNames[irregularStage]}</Title>

          {irregularStage === 1 && (
            <div className="matching-game">
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                点击左侧单词和右侧中文意思进行配对（{matchedPairs.length}/5）
              </Text>
              <div className="matching-container">
                <div className="matching-column">
                  {irregularData.matching.left?.map(item => (
                    <div
                      key={item.id}
                      className={`matching-item ${matchedPairs.includes(item.pairId) ? 'matched' : ''} ${matchingSelected.left?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleMatchingClick(item, 'left')}
                    >
                      <span className="matching-word">{item.value}</span>
                      <Button type="link" icon={<SoundOutlined />} onClick={(e) => { e.stopPropagation(); speakWord(item.value); }} />
                    </div>
                  ))}
                </div>
                <div className="matching-column">
                  {irregularData.matching.right?.map(item => (
                    <div
                      key={item.id}
                      className={`matching-item ${matchedPairs.includes(item.pairId) ? 'matched' : ''} ${matchingSelected.right?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleMatchingClick(item, 'right')}
                    >
                      {item.value}
                    </div>
                  ))}
                </div>
              </div>
              {matchedPairs.length >= 5 && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Button type="primary" size="large" onClick={nextIrregularQuestion}>进入下一关</Button>
                </div>
              )}
            </div>
          )}

          {irregularStage === 2 && irregularData.fillBlank[currentIndex] && (
            <div className="fillblank-game">
              <Progress percent={Math.round(((currentIndex + 1) / irregularData.fillBlank.length) * 100)} format={() => `${currentIndex + 1}/${irregularData.fillBlank.length}`} style={{ marginBottom: 24 }} />
              <div className="fillblank-sentence">
                <Text style={{ fontSize: 24 }}>{irregularData.fillBlank[currentIndex].sentence}</Text>
              </div>
              <div className="fillblank-options">
                {irregularData.fillBlank[currentIndex].options.map((opt, idx) => (
                  <Button
                    key={idx}
                    size="large"
                    className={`fillblank-option ${fillBlankAnswer === opt ? (opt === irregularData.fillBlank[currentIndex].answer ? 'correct' : 'wrong') : ''} ${showAnswer && opt === irregularData.fillBlank[currentIndex].answer ? 'correct' : ''}`}
                    onClick={() => !showAnswer && checkFillBlankAnswer(opt)}
                    disabled={showAnswer}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              {showAnswer && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Button type="primary" size="large" onClick={nextIrregularQuestion}>
                    {currentIndex < irregularData.fillBlank.length - 1 ? '下一题' : '进入下一关'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {irregularStage === 3 && irregularData.puzzles[currentIndex] && (
            <div className="puzzle-game">
              <Progress percent={Math.round(((currentIndex + 1) / irregularData.puzzles.length) * 100)} format={() => `${currentIndex + 1}/${irregularData.puzzles.length}`} style={{ marginBottom: 24 }} />
              <div className="puzzle-hint">
                <Text style={{ fontSize: 18 }}>提示：{irregularData.puzzles[currentIndex].hint}</Text>
              </div>
              <div className="puzzle-scrambled">
                <Text style={{ fontSize: 32, fontFamily: 'Courier New', letterSpacing: 8, color: '#999' }}>
                  {irregularData.puzzles[currentIndex].scrambled}
                </Text>
              </div>
              <div className="puzzle-input">
                <input
                  type="text"
                  value={puzzleInput}
                  onChange={(e) => setPuzzleInput(e.target.value)}
                  placeholder="输入正确的单词"
                  disabled={showAnswer}
                  onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkPuzzleAnswer()}
                  className="puzzle-text-input"
                />
              </div>
              {!showAnswer && (
                <Button type="primary" size="large" onClick={checkPuzzleAnswer} style={{ marginTop: 16 }}>
                  确认
                </Button>
              )}
              {showAnswer && (
                <div className="puzzle-result">
                  <div className={`result-badge ${puzzleInput.toLowerCase().trim() === irregularData.puzzles[currentIndex].word ? 'correct' : 'wrong'}`}>
                    {puzzleInput.toLowerCase().trim() === irregularData.puzzles[currentIndex].word ? (
                      <><CheckCircleOutlined /> 正确！</>
                    ) : (
                      <><CloseCircleOutlined /> 正确答案：{irregularData.puzzles[currentIndex].word}</>
                    )}
                  </div>
                  <Button type="primary" size="large" onClick={nextIrregularQuestion} style={{ marginTop: 16 }}>
                    {currentIndex < irregularData.puzzles.length - 1 ? '下一题' : '完成练习'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderIrregularResult = () => (
    <div className="english-result">
      <Card className="result-card">
        <div className="result-header">
          <TrophyOutlined className="trophy-icon" />
          <Title level={2}>练习完成！</Title>
        </div>
        <div className="result-message">
          <Text type="success" style={{ fontSize: 24 }}>太棒了！你完成了所有三个练习环节！</Text>
        </div>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Statistic title="配对连线" value="5/5" suffix="对" />
          </Col>
          <Col span={8}>
            <Statistic
              title="选词填空"
              value={answers.filter((a, i) => i < 5 && a.isCorrect).length}
              suffix={`/${irregularData.fillBlank?.length || 5} 对`}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="趣味字谜"
              value={answers.filter((a, i) => i >= 5 && a.isCorrect).length}
              suffix={`/${irregularData.puzzles?.length || 5} 对`}
            />
          </Col>
        </Row>
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={startIrregularPractice}>再来一次</Button>
          <Button size="large" onClick={() => setMode('menu')}>返回菜单</Button>
        </Space>
      </Card>
    </div>
  );

  const renderReadAlongPractice = () => {
    const currentSentence = readAlongSentences[currentIndex];
    if (!currentSentence) {
      return (
        <div className="english-practice" style={{ textAlign: 'center', padding: '48px' }}>
          <Text>加载中...</Text>
          <br /><br />
          <Button onClick={() => setMode('menu')}>返回菜单</Button>
        </div>
      );
    }

    const levelInfo = {
      review: { name: '复习', color: '#52c41a', icon: '🔄' },
      core: { name: '核心', color: '#1890ff', icon: '⭐' },
      challenge: { name: '挑战', color: '#fa8c16', icon: '🚀' },
    };

    const themeInfo = {
      cars: '小汽车',
      peppa: 'Peppa Pig',
      drawing: '画画',
      daily: '日常生活',
      animals: '动物',
      nature: '自然',
      food: '食物',
    };

    const level = levelInfo[currentSentence.level];

    const handleNext = () => {
      if (currentIndex < readAlongSentences.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setReadAlongShowText(false);
        setAnswers([...answers, { completed: true }]);
      } else {
        setAnswers([...answers, { completed: true }]);
        setMode('readalong-result');
      }
    };

    return (
      <div className="english-practice">
        <div className="practice-header">
          <Button onClick={() => setMode('menu')}>返回</Button>
          <div className="stage-indicator">
            <Tag color={level.color}>{level.icon} {level.name}</Tag>
            <Tag color="purple">{themeInfo[currentSentence.theme]}</Tag>
          </div>
          <Button icon={<ReloadOutlined />} onClick={shuffleReadAlongPractice}>换一批</Button>
        </div>
        <Progress percent={Math.round(((currentIndex + 1) / readAlongSentences.length) * 100)} />

        <Card className="practice-card readalong-card">
          <div className="readalong-content">
            <div className="sentence-number">
              第 {currentIndex + 1} / {readAlongSentences.length} 句
            </div>

            <div className="readalong-instruction">
              <Text type="secondary">点击播放按钮，仔细听句子，然后跟读</Text>
            </div>

            <div className="readalong-play-area">
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<SoundOutlined />}
                className="play-sentence-btn"
                onClick={() => speakWord(currentSentence.sentence, 0.8)}
                style={{ width: 80, height: 80, fontSize: 32 }}
              />
              <div className="play-hint">点击播放</div>
            </div>

            {!readAlongShowText && (
              <Button
                type="default"
                size="large"
                icon={<EyeOutlined />}
                onClick={() => setReadAlongShowText(true)}
                style={{ marginTop: 24 }}
              >
                查看原文
              </Button>
            )}

            {readAlongShowText && (
              <div className="sentence-reveal">
                <div className="sentence-text">{currentSentence.sentence}</div>
                <div className="sentence-meaning">{currentSentence.meaning}</div>
              </div>
            )}
          </div>

          <div className="readalong-actions">
            <Button type="primary" size="large" onClick={handleNext}>
              {currentIndex < readAlongSentences.length - 1 ? '下一句' : '完成练习'}
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderReadAlongResult = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const dayNum = (dayOfYear % 14) + 1;

    return (
      <div className="english-result">
        <Card className="result-card">
          <div className="result-header">
            <TrophyOutlined className="trophy-icon" />
            <Title level={2}>跟读完成！</Title>
          </div>
          <div className="result-message">
            <Text type="success" style={{ fontSize: 24 }}>太棒了！今天的跟读练习完成啦！</Text>
          </div>
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={8}>
              <Statistic title="今日" value={`第 ${dayNum} 天`} />
            </Col>
            <Col span={8}>
              <Statistic title="完成句子" value={readAlongSentences.length} suffix="句" />
            </Col>
            <Col span={8}>
              <Statistic title="完成率" value={100} suffix="%" />
            </Col>
          </Row>
          <Space style={{ marginTop: 24 }}>
            <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={startReadAlongPractice}>再练一次</Button>
            <Button size="large" onClick={() => setMode('menu')}>返回菜单</Button>
          </Space>
        </Card>
      </div>
    );
  };

  return (
    <div className="english-page">
      {mode === 'menu' && renderMainMenu()}
      {mode === 'dictation-menu' && renderCategoryMenu('dictation')}
      {mode === 'fillblank-menu' && renderCategoryMenu('fillblank')}
      {mode === 'practice' && practiceType === 'dictation' && renderDictationPractice()}
      {mode === 'practice' && practiceType === 'fillblank' && renderFillBlankPractice()}
      {mode === 'practice' && practiceType === 'longword' && renderLongWordPractice()}
      {mode === 'practice' && practiceType === 'irregular' && renderIrregularPractice()}
      {mode === 'practice' && practiceType === 'readalong' && renderReadAlongPractice()}
      {mode === 'result' && renderResult()}
      {mode === 'longword-result' && renderLongWordResult()}
      {mode === 'irregular-result' && renderIrregularResult()}
      {mode === 'readalong-result' && renderReadAlongResult()}
    </div>
  );
};

export default EnglishPage;
