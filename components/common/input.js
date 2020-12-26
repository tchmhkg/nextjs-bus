import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import useTranslation from "~/hooks/useTranslation";
import Suggestion from "../kmb/suggestion";

const Container = styled.div`
  background-color: ${({theme})=>theme.cardBackground};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.2);
  margin: 0 0 20px 0;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
  height: 50px;
  button {
      background-color: ${({theme})=>theme.toggleBackground};
      color: ${({theme})=>theme.inactiveMenu};
      width: 80px;
      height: 50px;
      appearance: none;
      border: none;
      font-size: 16px;
      border-radius: 5px;
      margin-left: 5px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 18px;
  width: 100%;
  ${'' /* background-color: ${props => props.theme.cardBackground}; */}
  background-color: transparent;
  transition: background-color 200ms linear;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.borderAlt};
  border-radius: 5px;
`;

const Clear = styled.div`
  position: absolute;
  right: 10px;
  top: 12px;
  font-size: 16px;
`;

const SearchInput = (props) => {
  const {t} = useTranslation();
  const searchTextInput = useRef(null);

  const handleChange = useCallback(
    (e) => {
      props?.onChange(e.target.value?.toUpperCase());
    },
    [props?.onChange]
  , [props?.value]);

  const clearInput = () => props?.onChange('');

  return (
    <Container>
      <InputWrapper>
        <Input
          autoCorrect="false"
          value={props?.value}
          onChange={handleChange}
          onFocus={props.onFocus}
          ref={searchTextInput}
          placeholder={t(props.placeholder)}
          aria-labelledby={t(props.placeholder)}
        />
        {props.value && <Clear onClick={clearInput}>{t('Clear')}</Clear>}
        {/* <button onClick={props.onClickButton}>{t('Submit')}</button> */}
      </InputWrapper>
      <Suggestion onClickSuggestion={props.onClickSuggestion} input={props.value} clickedSuggestion={props.clickedSuggestion} />
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
