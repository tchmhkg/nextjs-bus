import useTranslation from '@hooks/useTranslation';
import { getStringByLocale } from '@utils/index';
import dynamic from 'next/dynamic';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
const Bookmark = dynamic(import('@components/kmb/bookmark'));
const Etas = dynamic(import('@components/kmb/etas'));

const Fare = styled.div`
  margin-left: 0px;
  font-size: 14px;
`;

const BookmarkButton = styled(Bookmark)`
  position: absolute;
  right: 0;
  top: 0;
`;

interface IStop {
  stop: any
  refresh?: boolean

  setRefresh: Dispatch<SetStateAction<boolean>>
}

const Stop: React.FC<IStop> = ({ stop = {}, setRefresh = () => { }, refresh = false }) => {
  const [open, setOpen] = useState(false);
  const { t, locale } = useTranslation();
  const toggle = () => setOpen((prev) => !prev);

  // const fare = useMemo(() => `${t('Fare')}: $${stop.fare?.toFixed(1)}`, [stop?.fare, t]);
  // stop = {
  //   ...stop,
  //   id: `${stop.variant.route.number}_${stop.stop.id}_${stop.variant.route.bound}`,
  //   stop: {
  //     ...stop.stop,
  //     nameZh: stop.stop.nameZh,
  //     nameEn: stop.stop.nameEn,
  //   }
  // };
  // console.log(stop);

  return (
    <li>
      <BookmarkButton stop={stop} />
      <div className="stop-detail" onClick={toggle}>{getStringByLocale(stop, 'name', locale)}{/*stop.fare > 0 && <Fare>{fare}</Fare>*/}</div>
      {open && (
        <Etas setRefresh={setRefresh} refresh={refresh} stopId={stop.stop} />
      )}
    </li>
  );
};
export default React.memo(Stop);
