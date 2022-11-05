import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { confirmAlert } from 'react-confirm-alert';
import { Avatar, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getTracksByContextUrl } from '~/api/urls/tracksUrls';
import { removeTrackFromAlbumUrl } from '~/api/urls/albumsUrl';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const ManageTrackTable = ({ type, id, handleUpdateData }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getTracksByContextUrl + `?type=${type}&id=${id}`);
            setData(data.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line
    }, [id]);

    const handleRemoveTrackFromAlbum = async (trackId) => {
        try {
            const { data } = await axiosInstance.delete(removeTrackFromAlbumUrl(id), { data: { track: trackId } });
            handleUpdateData();

            toast.success(data.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={cx('container')}>
            <TableContainer component={Paper}>
                <Table
                    sx={{
                        minWidth: 650,
                        fontSize: '2rem',
                        '& th, & td': {
                            fontSize: '1.4rem',
                        },
                    }}
                    aria-label='simple table'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell align='right'>Name</TableCell>
                            <TableCell align='right'>Duration</TableCell>
                            <TableCell align='right'>Plays</TableCell>
                            <TableCell align='right'>Saved</TableCell>
                            <TableCell align='right'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component='th' scope='row'>
                                    <Avatar src={item.image} variant='square' />
                                </TableCell>
                                <TableCell align='right'>{item.name}</TableCell>
                                <TableCell align='right'>{fancyTimeFormat(item.duration)}</TableCell>
                                <TableCell align='right'>{item.plays}</TableCell>
                                <TableCell align='right'>{item.saved}</TableCell>
                                <TableCell align='right'>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        onClick={() =>
                                            confirmAlert({
                                                title: 'Confirm to remove this song from album',

                                                message: 'Are you sure to do this.',
                                                buttons: [
                                                    {
                                                        label: 'Yes',
                                                        onClick: () => handleRemoveTrackFromAlbum(item._id),
                                                    },
                                                    {
                                                        label: 'No',
                                                    },
                                                ],
                                                overlayClassName: 'overlay-custom-class-name ',
                                            })
                                        }
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';

    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
}

export default ManageTrackTable;
