import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { KmbContext } from '~/context/kmb-context';

const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundAlt};
  z-index: 10;
  position: absolute;
  top: 80px;
  max-height: 300px;
  width: calc(100vw - 60px);
  overflow-y: auto;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  .suggestion-item {
    margin: 5px 0;
    padding: 5px 10px;
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.borderAlt};
    }
  }
`;

const Suggestion = ({ input, onClickSuggestion = () => {}, clickedSuggestion = false, ...props }) => {
  const { routes } = React.useContext(KmbContext);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (input) {
      const filteredList = routes.filter((route) => route.indexOf(input) > -1);
      // console.log('filter',filteredList);
      setFiltered(filteredList);
    } else {
      setFiltered([]);
    }
  }, [input, routes]);

  const onClickItem = useCallback((route) => {
    onClickSuggestion(route);
  }, [])

  if(clickedSuggestion) return null;

  return (
    <Container>
      {filtered?.map((route) => (
        <div key={route} className="suggestion-item" onClick={() => onClickItem(route)}>
          {route}
        </div>
      ))}
    </Container>
  );
};

export default Suggestion;
