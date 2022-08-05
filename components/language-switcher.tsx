import { LanguageContext } from "@context/language-context";
import { languageNames, locales } from "@translations/config";
import { useRouter } from "next/router";
import React from 'react';
import styled from "styled-components";

interface IWrapper {
  inNavbar: boolean
}
interface ILocaleButton {
  selected: boolean
}

const Wrapper = styled.div<IWrapper>`
  display: flex;
  align-items: center;
`

const LocaleButton = styled.div<ILocaleButton>`
  cursor: pointer;
  color: ${({ selected, theme }) =>
    selected ? theme.black : theme.white};
  display: flex;
  justify-content: center;
  margin: 0 5px;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 18px;
  background: ${({ selected, theme }) =>
    selected ? theme.white : 'transparent'};
  @media (max-width: 374px) {
    font-size: 16px;
  }
`;

const LanguageSwitcher = ({ inNavbar = false }) => {
  const router = useRouter();
  const { locale: currentLocale } = React.useContext(LanguageContext);

  const handleLocaleChange = React.useCallback(
    (locale) => {
      if (currentLocale === locale) return;
      const regex = new RegExp(`^/(${locales.join("|")})`);
      router.push(router.pathname, router.asPath.replace(regex, `/${locale}`));
    },
    [router, currentLocale]
  );

  return (
    <Wrapper inNavbar={inNavbar}>
      {locales.map((locale) => (
        <LocaleButton
          key={locale}
          selected={locale === currentLocale}
          onClick={() => handleLocaleChange(locale)}
        >
          {languageNames[locale]}
        </LocaleButton>
      ))}
    </Wrapper>
  );
};

export default React.memo(LanguageSwitcher);
