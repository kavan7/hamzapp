// ParticleContainer.tsx
import React from 'react';
import './welcome.scss';
import 'animate.css';
import image from './logo.png';
import FancyButton from '../fancyButton/fancyButton'; // Ensure the correct import path

const ParticleContainer: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="particle-container">
      <div className="particles">
        {particles.map((_, index) => (
          <span key={index} className={`circle ${index}`}></span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: 0 }}>
        <img
          src={image.src}
          alt="Animated"
          className="animate__animated animate__backInDown"
          style={{ width: '300px', height: 'auto', marginBottom: '20px', borderRadius: '20px' }}
        />
        <h1 className="animate__animated animate__backInDown">INSERT WHATEVER TITLE HERE</h1>
        <div className="animate__animated animate__backInDown" style={{ marginTop: '20px' }}>
          <FancyButton buttonText="Click Me" width={200} height={60} color="#007BFF" />
        </div>
      </div>
    </div>
  );
};

export default ParticleContainer;