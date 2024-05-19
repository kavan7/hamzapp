"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const FlashcardsPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Array<[string, string, string]>>([
    ['Question 1', 'Answer 1', 'Answer 2'],
    ['Question 2', 'Answer 1', 'Answer 2'],
  ]);

  const [question, setQuestion] = useState('');
  const [incorrectAns, setIncorrectAns] = useState('');
  const [correctAns, setCorrectAns] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlashcards([...flashcards, [question, correctAns, incorrectAns]]);
    setQuestion('');
    setIncorrectAns('');
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
          <label>Correct Answer:</label>
          <input
            type="text"
            value={correctAns}
            onChange={(e) => setCorrectAns(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Incorrect Answer:</label>
          <input
            type="text"
            value={incorrectAns}
            onChange={(e) => setIncorrectAns(e.target.value)}
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
            <p><strong>Correct Answer:</strong> {flashcard[1]}</p>
            <p><strong>Incorrect Answer:</strong> {flashcard[2]}</p>
          </div>
        ))}
      </div>
      <Link href="../">
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>Go to Home</button>
      </Link>
    </div>
  );
};

export default FlashcardsPage;