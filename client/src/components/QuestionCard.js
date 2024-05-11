import React from 'react';
import { Card } from 'react-bootstrap';

const QuestionCard = ({ text }) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>You</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;