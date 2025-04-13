import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const CatList = () => {
  return (
    <Container>
      <Title>Cat List</Title>
      {/* Cat list content will go here */}
    </Container>
  );
};

export default CatList; 