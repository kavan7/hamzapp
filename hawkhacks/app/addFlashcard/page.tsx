// pages/flashcards.tsx
"use client";
import React, { useState } from 'react';

const FlashcardsPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Array<[string, string, string, string]>>([
    ['Question 1', 'Answer 1', 'Answer 2', 'Answer 1'],
    ['Question 2', 'Answer 1', 'Answer 2', 'Answer 2'],
  ]);

  const [question, setQuestion] = useState('');
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [correctAns, setCorrectAns] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlashcards([...flashcards, [question, ans1, ans2, correctAns]]);
    setQuestion('');
    setAns1('');
    setAns2('');
    setCorrectAns('');
  };

  return (
    <div>
      <h1>Flashcards</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Answer 1:</label>
          <input
            type="text"
            value={ans1}
            onChange={(e) => setAns1(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Answer 2:</label>
          <input
            type="text"
            value={ans2}
            onChange={(e) => setAns2(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correct Answer:</label>
          <input
            type="text"
            value={correctAns}
            onChange={(e) => setCorrectAns(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Flashcard</button>
      </form>
      <div>
        <h2>All Flashcards</h2>
        {flashcards.map((flashcard, index) => (
          <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <p><strong>Question:</strong> {flashcard[0]}</p>
            <p><strong>Answer 1:</strong> {flashcard[1]}</p>
            <p><strong>Answer 2:</strong> {flashcard[2]}</p>
            <p><strong>Correct Answer:</strong> {flashcard[3]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardsPage;