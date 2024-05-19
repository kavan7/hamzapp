"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import '../styles/globals.css';

const FlashcardsPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Array<[string, string, string, string]>>([
    ['Which language is primarily used for web development along with HTML and CSS', 'Javascript', 'Python', 'Javascript'],
    ['What is the purpose of a "for loop" in programming',  'To define a new variable', 'To iterate over a sequence of elements', 'To iterate over a sequence of elements'],
    ['Which of the following is a version control system', 'Git', 'SSH', 'Git'],
    ['What does the python function len() do', 'converts a value to a string', 'returns the length of an object', 'returns the length of an object'],
    ['What does SQL stand for', 'Structured Query Language', 'Simple Query List', 'Structured Query Language'],
    ['Which HTML tag is used to create a hyperlink', '<link>', '<a>', '<a>'],
    ['Which language is primarily used for iOS app development', 'Swift', 'Kotlin', 'Swift'],
    ['What is the main purpose of CSS in web development', 'To structure the content of web pages', 'To style and layout web pages', 'To style and layout web pages'],
    ['What does API stand for', 'Advanced Programming Instruction', 'Application Programming Interface', 'Application Programming Interface'],
    ['In Java, what keyword is used to define a class', 'class', 'define', 'class']
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
    <div className="flashcards-page">
      <h1 className="title">Flashcards</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ans1">Answer 1:</label>
            <input
              type="text"
              id="ans1"
              value={ans1}
              onChange={(e) => setAns1(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ans2">Answer 2:</label>
            <input
              type="text"
              id="ans2"
              value={ans2}
              onChange={(e) => setAns2(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="correctAns">Correct Answer:</label>
            <input
              type="text"
              id="correctAns"
              value={correctAns}
              onChange={(e) => setCorrectAns(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Flashcard</button>
        </form>
      </div>

      <div className="flashcards-list">
        <h2>All Flashcards</h2>
        {flashcards.length === 0 ? (
          <p>No flashcards available.</p>
        ) : (
          flashcards.map((flashcard, index) => (
            <div key={index} className="flashcard">
              <p><strong>Question:</strong> {flashcard[0]}</p>
              <p><strong>Answer 1:</strong> {flashcard[1]}</p>
              <p><strong>Answer 2:</strong> {flashcard[2]}</p>
              <p><strong>Correct Answer:</strong> {flashcard[3]}</p>
            </div>
          ))
        )}
      </div>

      <Link href="/home">
        <button className="home-button">Go to Home</button>
      </Link>
    </div>
  );
};

export default FlashcardsPage;