import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundAlt};
  z-index: 10;
  position: absolute;
  top: 40px;
  max-height: 300px;
  width: calc(100vw - 31px);
  overflow-y: auto;
  .suggestion-item {
    margin: 5px 0;
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.borderAlt};
    }
  }
`;

const Suggestion = ({ input, onClickSuggestion = () => {}, clickedSuggestion, ...props }) => {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const getDataFromStorage = async () => {
      const rawData = await window.localStorage.getItem('kmb_routes_list');
      // console.log('rawData from sugg',rawData);
      if(rawData) {
        const dataArray = [...new Set(rawData.split(','))];
        console.log(dataArray)
        setList(dataArray);
      }
    };
    if (!list?.length) {
      getDataFromStorage();
    }
  }, []);

  useEffect(() => {
    if (input) {
      const filteredList = list.filter((route) => route.indexOf(input) > -1);
      // console.log('filter',filteredList);
      setFiltered(filteredList);
    } else {
      setFiltered([]);
    }
  }, [input]);

  const onClickItem = (route) => {
    onClickSuggestion(route);
  }

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
