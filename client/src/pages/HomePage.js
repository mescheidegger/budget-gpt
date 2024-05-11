import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import QuestionCard from '../components/QuestionCard';
import ResponseCard from '../components/ResponseCard';
import { submitChatQuestion } from '../api/BudgetGPT';
import '../index.css';

const HomePage = ({ selectedChatHistory, onNewChat }) => {
  const [chatHistory, setChatHistory] = useState(selectedChatHistory);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Add this line to track loading state
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    setChatHistory(selectedChatHistory);
  }, [selectedChatHistory]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (currentQuestion.trim() !== '') {
      setIsLoading(true); // Start loading
      try {
        const isFirstQuestion = chatHistory.messages.length === 0;
        const creationDateTime = isFirstQuestion ? new Date().toISOString() : chatHistory.createddt;
        const response = await submitChatQuestion(currentQuestion, creationDateTime);

        setChatHistory({
          ...chatHistory,
          createddt: isFirstQuestion ? creationDateTime : chatHistory.createddt,
          messages: [...chatHistory.messages, { role: 'user', content: currentQuestion }, { role: 'assistant', content: response.response }],
        });

        if (isFirstQuestion && onNewChat) {
          onNewChat();
        }
      } catch (error) {
        console.error('Error submitting question:', error);
      }
      setCurrentQuestion('');
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Container className="instructor-container">
      <div className="chat-window" ref={chatWindowRef}>
        {chatHistory.messages.length === 0 ? (
          <Card>
            <Card.Body>Begin by entering a question.</Card.Body>
          </Card>
        ) : (
          chatHistory.messages.map((message, index) => (
            <div key={index}>
              {message.role === 'user' ? (
                <QuestionCard text={message.content} />
              ) : (
                <ResponseCard text={message.content} isLoading={index === chatHistory.messages.length - 1 && isLoading} />
              )}
            </div>
          ))
        )}
      </div>
      <Form onSubmit={handleSubmit} className="sticky-footer">
        <Form.Group className="mb-3" controlId="questionInput">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your question"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            disabled={isLoading} // Optionally disable input while loading
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading}>
          Submit
        </Button>
        {isLoading && <Spinner animation="border" variant="primary" />} {/* Optionally show a spinner next to the button */}
      </Form>
    </Container>
  );
};

export default HomePage;
