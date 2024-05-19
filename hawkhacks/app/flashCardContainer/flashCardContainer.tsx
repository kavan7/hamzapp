import styled from 'styled-components';

const FlashcardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  max-width: 1200px; // Adjust as needed
  margin: 0 auto;

  > div {
    flex: 1 0 31%; // Adjust to ensure only 6 items per row, 100% / 6 ≈ 16.67%, but with margin adjustments
    margin: 10px;
    box-sizing: border-box;
  }
`;

export default FlashcardContainer;
