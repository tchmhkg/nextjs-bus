import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import useTranslation from "~/hooks/useTranslation";
import Suggestion from "../kmb/suggestion";

const Container = styled.div`
  position: sticky;
  z-index: 10;
  top: 70px;
  left: 0;
  padding: 0 15px;
  margin: 0 -15px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background-color: ${(props) => props.theme.background};
  transition: background-color 200ms linear;
  position: relative;
  height: 40px;
  button {
      background-color: ${({theme})=>theme.toggleBackground};
      color: ${({theme})=>theme.inactiveMenu};
      width: 80px;
      height: 40px;
      appearance: none;
      border: none;
      font-size: 16px;
      border-radius: 5px;
      margin-left: 5px;
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
  border-radius: 5px;
`;

const Clear = styled.div`
  position: absolute;
  right: 10px;
  top: 7px;
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
          ref={searchTextInput}
          placeholder={t(props.placeholder)}
          aria-labelledby={t(props.placeholder)}
        />
        {props.value && <Clear onClick={clearInput}>{t('Clear')}</Clear>}
        {/* <button onClick={props.onClickButton}>{t('Submit')}</button> */}
      </InputWrapper>
      {(props.value && !props.clickedSuggestion) && <Suggestion onClickSuggestion={props.onClickSuggestion} input={props.value} />
}
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
