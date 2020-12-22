import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import useTranslation from "~/hooks/useTranslation";

const Container = styled.div`
  position: relative;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background-color: ${(props) => props.theme.background};
  transition: background-color 200ms linear;
  position: relative;
  height: 40px;
  margin-bottom: 10px;
  button {
      background-color: ${({theme})=>theme.toggleBackground};
      color: ${({theme})=>theme.inactiveMenu};
      width: 80px;
      height: 40px;
      appearance: none;
      border: none;
      font-size: 16px;
  }
`;

const Input = styled.input`
  padding: 5px;
  font-size: 16px;
  width: 100%;
  background-color: ${props => props.theme.background};
  transition: background-color 200ms linear;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.borderAlt};
`;

const SearchInput = (props) => {
  const {t} = useTranslation();
  const searchTextInput = useRef(null);

  const handleChange = useCallback(
    (e) => {
      props?.onChange(e);
    },
    [props?.onChange]
  , [props?.value]);

  return (
    <Container>
      <InputWrapper>
        <Input
          autoCorrect="false"
          value={props?.value}
          onChange={handleChange}
          ref={searchTextInput}
          placeholder={t(props.placeholder)}
          aria-labelledby={t(props.placeholder)}
        />
        <button onClick={props.onClickButton}>{t('Submit')}</button>
      </InputWrapper>

    </Container>
  );
};

SearchInput.defaultProps = {
  placeholder: "Search",
  placeholderTextColor: null,
  onChange: () => {},
  value: "",
  onSearchClear: () => {},
};

export default SearchInput;
