import React, { useEffect, useState } from 'react';
import Layout from "~/components/layout";
import BookmarkList from "~/components/bookmark-list";

const BookmarkPage = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => {
    const getBookmarks = async () => {
      try {
        setLoading(true);
        const existing = await window.localStorage.getItem('stops');
  
        const existingJson = existing ? JSON.parse(existing) : [];
        setList(existingJson);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    getBookmarks();
  }, [])

  if(loading) return null;
  return (
    <Layout>
      <BookmarkList list={list}/>
    </Layout>
  );
};
export default BookmarkPage;

