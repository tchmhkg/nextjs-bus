import dynamic from 'next/dynamic';
import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { KmbContext } from '~/context/kmb-context';
import useTranslation from '~/hooks/useTranslation';
import { getKmbRoutes } from '~/services/kmb-service';
// import Menu from "~/components/menu";
const LanguageSwitcher = dynamic(import('~/components/language-switcher'));
const ThemeSwitcher = dynamic(import('~/components/theme-switcher'));
const Image = dynamic(import('next/image'));

const Container = styled.div`
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background-color: ${(props) => props.theme.kmbRed};
  z-index: ${({ shouldUpdateZIndex }) => (shouldUpdateZIndex ? 20 : 15)};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
  @media (min-width: 768px) {
    padding-right: 15px;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const GitHubIconWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  @media (max-width: 374px) {
    margin-right: 15px;
  }
`;

const UpdateButton = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  margin: 0 20px;
`;

const GitHubButton = memo(() => (
  <GitHubIconWrapper>
    <a
      href="https://github.com/tchmhkg/nextjs-bus"
      rel="noopener"
      target="_blank"
    >
      <Image
        src="/images/github.png"
        width={30}
        height={30}
        alt="GitHub Icon"
      />
    </a>
  </GitHubIconWrapper>
));

const Header = () => {
  const { t } = useTranslation();
  const [loading, isLoading] = useState(false)
  const { setRoutes } = React.useContext(KmbContext);

  const updateRoutes = async () => {
    isLoading(true)
    const routes = await getKmbRoutes();
    if (routes) {
      setRoutes(routes);
      alert(t('Updated'));
    }
    isLoading(false)
  };
  return (
    <Container>
      <LeftWrapper>
        <UpdateButton onClick={updateRoutes}>{t(loading ? 'Updating' : 'Update')}</UpdateButton>
      </LeftWrapper>
      <RightWrapper>
        <GitHubButton />
        <LanguageSwitcher inNavbar />
        <ThemeSwitcher inNavbar />
      </RightWrapper>
    </Container>
  );
};

export default memo(Header);
