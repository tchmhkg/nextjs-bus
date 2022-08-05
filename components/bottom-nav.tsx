import useTranslation from '@hooks/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import styled from 'styled-components';

interface INavItem {
  selected?: boolean
  active: boolean
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  padding-bottom: 35px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: ${({ theme }) => theme.background};
  @media (min-width: 768px) {
    height: 60px;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.2);
  color: ${({ theme }) => theme.text};
`;

const NavItem = styled.div<INavItem>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) =>
    selected ? theme.background : 'transparent'};
  height: 50px;
  cursor: pointer;
  position: relative;
  font-weight: ${({ active }) => active ? '500' : 'normal'};
  &:not(:last-child) {
    &::after {
      content: "";
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 1px;
      height: 25px;
      background: ${({ theme }) => theme.text};
      position: absolute;
    }
  }
  @media (min-width: 768px) {
    height: 60px;
  }
`;

const Item = ({ label, link }) => {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const isActive = router.asPath === `/${locale}${link ? ('/' + link) : ''}`

  return (
    <Link
      key={`${label}-${link}`}
      href={`/[lang]/${link}`}
      as={`/${locale}${link ? ('/' + link) : ''}`}
    >
      <NavItem active={isActive}>
        <div>{t(label)}</div>
      </NavItem>
    </Link>
  );
};

const BottomNav = () => {
  return (
    <Container>
      <Wrapper>
        <Item label="KMB" link="" />
        <Item label="Bookmark" link="bookmark" />
      </Wrapper>
    </Container>
  );
};

export default memo(BottomNav);
