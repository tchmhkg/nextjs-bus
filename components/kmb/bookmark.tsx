import { HeartBorderIcon, HeartFullIcon } from '@components/ui/icon';
import { motion } from 'framer-motion';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import React, { useCallback, useEffect, useState } from "react";
import styles from './bookmark.module.scss';

const iconAnimConfig = { scale: 1.3 };

const Bookmark = ({ stop }) => {
  const [saved, setSaved] = useState(null);

  const onPressSave = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('stops');

      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = _find(existingJson, ['id', stop.id]);
      if (isExisted) {
        return;
      }
      const newList = [
        ...existingJson,
        stop,
      ];

      await window.localStorage.setItem('stops', JSON.stringify(newList));
      setSaved(true);
    } catch (e) {
      console.log(e);
    }
  }, [stop]);

  const onPressRemove = useCallback(async () => {
    try {
      const existing = await window.localStorage.getItem('stops');

      const existingJson = existing ? JSON.parse(existing) : [];
      const newList = _filter(
        existingJson,
        (item) => item.id !== stop.id,
      );

      await window.localStorage.setItem('stops', JSON.stringify(newList));
      setSaved(false);
    } catch (e) {
      console.log(e);
    }
  }, [stop]);

  useEffect(() => {
    const getStatusFromStorage = async () => {
      const existing = await window.localStorage.getItem('stops');
      const existingJson = existing ? JSON.parse(existing) : [];
      const isExisted = existingJson.find(item => item.id === stop.id);
      if (isExisted) {
        setSaved(true);
      }
    };
    getStatusFromStorage();
  }, [stop.id]);

  // TODO: merge to single function
  return (
    <motion.div className={styles.wrapper} whileTap={iconAnimConfig} onClick={saved ? onPressRemove : onPressSave}>
      {saved ? <HeartFullIcon /> : <HeartBorderIcon />}
    </motion.div>
  );
};

export default React.memo(Bookmark);
