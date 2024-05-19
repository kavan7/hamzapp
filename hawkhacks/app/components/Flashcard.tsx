// components/Flashcard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FlashcardContainer from '../flashCardContainer/flashCardContainer';

const Card = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
`;

const Question = styled.div`
  font-size: 1.5em;
  flex: 2;
  margin-right: 20px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AnswerButton = styled.button<{ $correct: boolean; $selected: boolean }>`
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #2952d9;
  &:hover {
    background-color: '#005bb5';
  }
`;

interface FlashcardProps {
  question: string;
  choices: [string, string]; // Ensure exactly two choices
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
  onNewQuestion: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, choices, correctAnswer, onAnswer, onNewQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    setSelectedAnswer(answer);
    onAnswer(answer === correctAnswer);
    onNewQuestion(); // Trigger generation of a new question
  };

  // Reset selectedAnswer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question]);

  return (
    <Card>
      <Question>{question}</Question>
      <Options>
        {choices.map((choice, index) => (
          <AnswerButton
            key={index}
            onClick={() => handleAnswer(choice)}
            $correct={choice === correctAnswer}
            $selected={choice === selectedAnswer}
          >
          {index ? "Squat: " : "Pushup: "}{choice}
          </AnswerButton>
        ))}
      </Options>
    </Card>
  );
};

export default Flashcard;