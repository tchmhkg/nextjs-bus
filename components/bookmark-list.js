import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const BookmarkItem = dynamic(import('~/components/bookmark-item'));

const Container = styled.div`
  margin: 30px 0 70px 0;
`;

const BookmarkList = ({ loading, list = [] }) => {
  return list ? (
    <Container>
      {list?.map((item) => (
        <BookmarkItem key={item.id} item={item} />
      ))}
    </Container>
  ) : (
    null
  );
};

export default React.memo(BookmarkList);
