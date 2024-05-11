import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Masthead from './components/Masthead';

const App = () => {
  const [selectedChatHistory, setSelectedChatHistory] = useState({ createddt: null, messages: [] });
  const [refreshChatListFn, setRefreshChatListFn] = useState(null);

  const handleChatHistorySelection = (chatHistory) => {
    setSelectedChatHistory(chatHistory);
  };

  const refreshChatList = useCallback((fn) => {
    setRefreshChatListFn(() => fn);
  }, []);

  const handleRefreshChatList = useCallback(() => {
    if (refreshChatListFn) {
      refreshChatListFn();
    }
  }, [refreshChatListFn]);

  return (
    <Router>
      <Masthead onSelectChatHistory={handleChatHistorySelection} refreshChatList={refreshChatList} />
      <Routes>
        <Route path="/" element={<HomePage selectedChatHistory={selectedChatHistory} onNewChat={handleRefreshChatList} />} />
      </Routes>
    </Router>
  );
};

export default App;
