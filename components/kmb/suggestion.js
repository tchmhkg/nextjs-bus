import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useStorage } from '~/hooks/useStorage';
import { BUS_ROUTES } from '~/utils/bus-routes';

const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundAlt};
  z-index: 10;
  position: absolute;
  top: 120px;
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
  const {localStorage} = useStorage();
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const getDataFromStorage = async () => {
      const rawData = BUS_ROUTES;//await localStorage.getItem('kmb_routes_list');
      if(rawData) {
        const dataArray = [...new Set(rawData.split(','))];
        setList(dataArray);
      }
    };
    if(localStorage && (!list || !list?.length)) {
      getDataFromStorage();
    }
  }, [localStorage]);

  useEffect(() => {
    if (input) {
      const filteredList = list.filter((route) => route.indexOf(input) > -1);
      // console.log('filter',filteredList);
      setFiltered(filteredList);
    } else {
      setFiltered([]);
    }
  }, [input]);

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
