import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { format } from 'date-fns';
import useTranslation from '~/hooks/useTranslation';

const Etas = ({stopping, setRefresh = () => {}, refresh = false}) => {
    const [times, setTimes] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        if(stopping) {
            getSchedules();
        }
    }, [stopping])

    useEffect(() => {
        if(stopping) {
            getSchedules();
        }
    }, [refresh])

    const getSchedules = async () => {
        try {
            const res = await Axios.get('/api/bus/kmb-eta', {
                params: {stopping: JSON.stringify(stopping)}
            });
            if(res?.data?.data){
                setTimes(res?.data?.data);
            }
            if(refresh) {
                setRefresh(false);
            }
        } catch (err) {
            console.log(err);
            if(refresh) {
                setRefresh(false);
            }
        }
    }

    if(!times || !times?.length) return null;

    return (
        <div>{times?.map(time => {
            if(!time.realtime && time.remark) {
                return `${format(new Date(time.time), 'HH:mm')} (${t(time.remark)})`
            }
            return format(new Date(time.time), 'HH:mm')
        }).join(', ')}</div>
    )
}

export default Etas;