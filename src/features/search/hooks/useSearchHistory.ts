import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'spyt-music-search-history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 初始化：从localStorage加载搜索历史
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
      // 如果加载失败，重置搜索历史
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  }, []);

  // 添加搜索项到历史记录
  const addToHistory = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setSearchHistory(prevHistory => {
      // 如果已存在相同查询，先移除旧的
      const filteredHistory = prevHistory.filter(item => item !== trimmedQuery);
      
      // 将新查询添加到开头
      const newHistory = [trimmedQuery, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      
      // 保存到localStorage
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
      
      return newHistory;
    });
  };

  // 清除所有搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  // 删除单个搜索历史项
  const removeFromHistory = (query: string) => {
    setSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item !== query);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};