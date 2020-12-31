import React from 'react';
import dynamic from 'next/dynamic';

const BookmarkItem = dynamic(import('~/components/bookmark-item'));

const BookmarkList = ({ loading, list = [] }) => {
  return list ? (
    <>
      {list?.map((item) => (
        <BookmarkItem key={item.id} item={item} />
      ))}
    </>
  ) : (
    null
  );
};

export default React.memo(BookmarkList);
