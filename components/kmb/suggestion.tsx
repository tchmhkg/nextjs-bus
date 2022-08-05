import { getBusState, setRoute } from '@store/slices/busSlice';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

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

const Suggestion = ({ input, inputFocused = false, onClick, ...props }) => {
  const dispatch = useDispatch()
  const { routes } = useSelector(getBusState)
  const [filtered, setFiltered] = useState([]);
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    if (inputFocused) {
      setShow(true)
    }
  }, [inputFocused])

  useEffect(() => {
    if (input) {
      const filteredList = Object.keys(routes).filter((route) => route.indexOf(input) > -1);
      // console.log('filter',filteredList);
      setFiltered(filteredList);
      setShow(true)
    } else {
      setFiltered([]);
    }
  }, [input, routes]);

  const onClickItem = useCallback((route: string) => {
    const routeData = routes[route]
    dispatch(setRoute({ route, directions: routeData }))
    onClick(route)
    setShow(false)
  }, [dispatch, onClick, routes])

  if (!show) return null;

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
