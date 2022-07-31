import React, { useCallback, useEffect, useState } from 'react';
import Layout from '@components/layout';
import BookmarkList from '@components/bookmark-list';
import styled from 'styled-components';
import useTranslation from '@hooks/useTranslation';
import Refresh from '@components/refresh';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({theme}) => theme.background};
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  padding: 20px 15px 10px 15px;
  height: 50px;
`;
const Heading = styled.h2`
  color: ${(props) => props.theme.text};
  margin: 0 0 5px 0;
`;

const BookmarkPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [list, setList] = useState([]);

  const getBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const existing = window.localStorage.getItem('stops');
      const existingJson = existing ? JSON.parse(existing) : [];

      setList(existingJson);
      setLoading(false);
      if (refresh) {
        setRefresh(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (refresh) {
        setRefresh(false);
      }
    }
  }, [refresh])
  
  useEffect(() => {
    getBookmarks();
  }, [getBookmarks]);

  useEffect(() => {
    if (refresh) {
      getBookmarks();
    }
  }, [getBookmarks, refresh]);

  const onClickRefresh = useCallback(() => setRefresh(true), []);

  return (
    <Layout>
      <Header>
        <Heading>{t('Bookmark')}</Heading>
        <Refresh onClick={onClickRefresh} />
      </Header>
      {list?.length ? (
        <BookmarkList list={list} />
      ) : (
        t("It's empty here.")
      )}
    </Layout>
  );
};
export default BookmarkPage;
