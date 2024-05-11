import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import ChatHistoryOffcanvas from './ChatHistoryOffcanvas'; // Adjust the import path as needed
import { fetchChatHistoryList, renameChatHistory } from '../api/BudgetGPT'; // Adjust the import path as needed
import './styles/Masthead.css';

const Masthead = ({ onSelectChatHistory, refreshChatList }) => {
  const [show, setShow] = useState(false);
  const [chatHistoryList, setChatHistoryList] = useState([]);

  const handleFetchChatHistoryList = useCallback(async () => {
    try {
      const data = await fetchChatHistoryList();
		    // Sort the chat history list by the creation date extracted from the file name
    const sortedData = data
      .map(fileName => {
        // Extract and format the name of the chat history item
        const formattedName = fileName.substring(0, fileName.lastIndexOf('_'));
        const dateStr = fileName.substring(fileName.lastIndexOf('_') + 1, fileName.lastIndexOf('.json')).replace(/-/g, ':');
        const validDate = new Date(dateStr.replace(/(\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3'));
        const age = getChatAge(validDate);
        return {
          fileName,
          formattedName,
          validDate, // Add validDate property for sorting
          age
        };
      })
      .sort((a, b) => b.validDate - a.validDate); // Sort using the validDate property
    setChatHistoryList(sortedData);
    } catch (error) {
      console.error('Error fetching chat history list:', error);
    }
  }, []);

  // Function to calculate the age of the chat history item
  const getChatAge = (chatDate) => {
    const now = new Date();
    const diff = now - chatDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return '1 day ago';
    } else {
      return `${days} days ago`;
    }
  };

  useEffect(() => {
    handleFetchChatHistoryList();
  }, [handleFetchChatHistoryList]);

  useEffect(() => {
    if (refreshChatList) {
      refreshChatList(handleFetchChatHistoryList);
    }
  }, [refreshChatList, handleFetchChatHistoryList]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectChatHistory = async (fileName) => {
    if (fileName === 'new-chat') {
      onSelectChatHistory({ createddt: null, messages: [] });
    } else {
      const response = await fetch(`/api/chat-history/${fileName}`);
      const data = await response.json();
      onSelectChatHistory(data);
    }
    handleClose();
  };

  const handleRenameChatHistory = async (oldFileName, newName) => {
    try {
      await renameChatHistory(oldFileName, newName);
      handleFetchChatHistoryList(); // Refresh the list
    } catch (error) {
      alert(`Error renaming chat history: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" fixed="top" variant="dark">
        <List
          size={30}
          color="white"
          onClick={handleShow}
          style={{ cursor: 'pointer' }}
        />
      </Navbar>
      <ChatHistoryOffcanvas
        show={show}
        handleClose={handleClose}
        chatHistoryList={chatHistoryList}
        handleSelectChatHistory={handleSelectChatHistory}
        handleRenameChatHistory={handleRenameChatHistory}
      />
    </>
  );
};


export default Masthead;
