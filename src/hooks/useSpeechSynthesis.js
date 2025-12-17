import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';

/**
 * 自定义 Hook：用于语音合成功能
 * 支持中英文语音播放
 */
export const useSpeechSynthesis = (language = 'en-US') => {
  const [voices, setVoices] = useState([]);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          voicesLoadedRef.current = true;
        }
      }
    };

    loadVoices();
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const getBestVoice = useCallback((preferredNames = []) => {
    if (voices.length === 0) return null;

    // 优先选择指定的语音
    for (const name of preferredNames) {
      const voice = voices.find(v => 
        v.name.includes(name) && 
        (language === 'zh-CN' ? v.lang.includes('zh') : v.lang.includes(language))
      );
      if (voice) return voice;
    }

    // 回退到匹配语言的语音
    if (language === 'zh-CN') {
      return voices.find(v => v.lang.includes('zh-CN') || v.lang.includes('zh_CN')) || null;
    } else {
      return voices.find(v => v.lang === language || v.lang.startsWith(language)) || 
             voices.find(v => v.lang.startsWith('en')) || null;
    }
  }, [voices, language]);

  const speak = useCallback((text, options = {}) => {
    if (!('speechSynthesis' in window)) {
      message.warning('您的浏览器不支持语音功能');
      return;
    }

    const {
      rate = 0.75,
      pitch = 1.0,
      volume = 1.0,
      preferredVoices = [],
      onEnd = null,
      onError = null,
    } = options;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    const bestVoice = getBestVoice(preferredVoices);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    if (onError) {
      utterance.onerror = onError;
    }

    window.speechSynthesis.speak(utterance);
  }, [language, getBestVoice]);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakSequentially = useCallback((texts, options = {}) => {
    if (!('speechSynthesis' in window)) {
      message.warning('您的浏览器不支持语音功能');
      return;
    }

    const {
      delay = 600,
      rate = 0.75,
      preferredVoices = [],
    } = options;

    window.speechSynthesis.cancel();

    let currentDelay = 0;
    texts.forEach((text, index) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = rate;
        
        const bestVoice = getBestVoice(preferredVoices);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        window.speechSynthesis.speak(utterance);
      }, currentDelay);
      
      currentDelay += delay;
    });
  }, [language, getBestVoice]);

  return {
    speak,
    cancel,
    speakSequentially,
    voices,
    voicesLoaded: voicesLoadedRef.current,
  };
};
