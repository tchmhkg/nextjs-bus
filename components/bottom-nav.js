import Link from 'next/link';
import React, { memo, useState } from 'react';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  ${'' /* transition: background-color 200ms linear; */}
  color: ${({ theme }) => theme.text};
  @media (min-width: 768px) {
    height: 60px;
  }
`;

const NavItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) =>
    selected ? theme.background : 'transparent'};
  height: 50px;
  cursor: pointer;
  &:not(:last-child) {
    border-right: 1px solid;
  }
  @media (min-width: 768px) {
    height: 60px;
  }
`;

const Item = ({ label, link }) => {
  const { t, locale } = useTranslation();
  return (
    <Link
      key={`${label}-${link}`}
      href={`/[lang]/${link}`}
      as={`/${locale}/${link}`}
    >
      <NavItem>
        <div>{t(label)}</div>
      </NavItem>
    </Link>
  );
};

const BottomNav = () => {
  return (
    <Container>
      <Item label="KMB" link="" />
      <Item label="Bookmark" link="bookmark" />
    </Container>
  );
};

export default memo(BottomNav);
