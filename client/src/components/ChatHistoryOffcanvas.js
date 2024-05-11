import React, { useState } from 'react';
import { Offcanvas, ListGroup, Form } from 'react-bootstrap';
import { Pencil, Check } from 'react-bootstrap-icons';

const ChatHistoryOffcanvas = ({ show, handleClose, chatHistoryList, handleSelectChatHistory, handleRenameChatHistory }) => {
  const [editing, setEditing] = useState(null);
  const [newName, setNewName] = useState('');

  const handleEditClick = (fileName, formattedName) => {
    setEditing(fileName);
    setNewName(formattedName);
  };

  const handleSaveClick = (fileName, originalName) => {
    if (newName !== originalName) {
      handleRenameChatHistory(fileName, newName);
    }
    setEditing(null);
    setNewName('');
  };
  

  return (
    <Offcanvas show={show} onHide={handleClose} placement="start" className="bg-dark text-white">
      <Offcanvas.Header closeButton closeLabel="Close" closeVariant="white">
        <Offcanvas.Title>Conversations</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ListGroup>
          <ListGroup.Item action onClick={() => handleSelectChatHistory('new-chat')}>
            New Chat
          </ListGroup.Item>
          {chatHistoryList.map((chatHistory, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {editing === chatHistory.fileName ? (
                <>
                  <Form.Control
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <Check onClick={() => handleSaveClick(chatHistory.fileName, chatHistory.formattedName)}
                        size={40} 
                        color="green"
                  />
                </>
              ) : (
                <>
                  <div onClick={() => handleSelectChatHistory(chatHistory.fileName)}>
                    {chatHistory.formattedName} - {chatHistory.age}
                  </div>
                  <Pencil onClick={() => handleEditClick(chatHistory.fileName, chatHistory.formattedName)} 
                          size={20}
                          color="Black" 
                  />
                </>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ChatHistoryOffcanvas;
