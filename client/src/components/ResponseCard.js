import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResponseCard = ({ text, isLoading }) => {
  const renderContent = () => {
    // Split the text by code block delimiters (```)
    const parts = text.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      // Check if the part is a code block
      const match = part.match(/```(\w+)\s([\s\S]*?)```/);
      if (match) {
        const language = match[1];
        const code = match[2];
        return (
          <SyntaxHighlighter key={index} language={language} style={dark}>
            {code}
          </SyntaxHighlighter>
        );
      }
      return <div key={index}>{part}</div>;
    });
  };

  return (
    <Card className="mb-2 d-flex flex-row align-items-center">
      <Card.Body>
        <Card.Title>GPT</Card.Title>
        {isLoading ? <Spinner animation="border" /> : renderContent()}
      </Card.Body>
    </Card>
  );
};

export default ResponseCard;
