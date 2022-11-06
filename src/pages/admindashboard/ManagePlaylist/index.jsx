import React, { useEffect, useState, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import Moment from 'moment';
import { IconButton, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { getPlaylistsByContextUrl } from '~/api/urls/playlistsUrl';
import ActionMenu from '~/components/admin/ActionsMenu';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const ManagePlaylist = () => {
    const [searchPlaylist, setSearchPlaylist] = useState('');
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);

    const debouncedValue = useDebounce(searchPlaylist, 500);

    const searchPlaylistInputRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance(getPlaylistsByContextUrl + `?search=${searchPlaylist}`);
            setRows(data.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, update]);

    const handleUpdateData = () => {
        setUpdate(!update);
    };

    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            width: 35,
            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.row.image} sx={{ width: 30, height: 30 }} variant='square' />
            ),
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'owner',
            headerName: 'Owner',
            flex: 1,
            valueGetter: (params) => params.row.owner.name,
        },
        {
            field: 'tracks',
            headerName: 'Tracks',
            flex: 1,
            valueGetter: (params) => params.row.tracks.length,
        },
        {
            field: 'saved',
            headerName: 'Saved',
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            valueGetter: (params) => Moment(params.row.createdAt).format('DD-MM-YYYY'),
        },
        {
            field: 'isPublic',
            headerName: 'Is Public',
            flex: 1,
            renderCell: (params) => {
                if (params.row.isPublic) {
                    return <CheckCircleIcon color='success' fontSize='large' />;
                } else {
                    return <HighlightOffIcon color='error' fontSize='large' />;
                }
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => <ActionMenu handleUpdateData={handleUpdateData} type='playlist' row={params.row} />,
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>Tracks</div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder='Search for playlist, owner'
                    value={searchPlaylist}
                    ref={searchPlaylistInputRef}
                    onChange={() => setSearchPlaylist(searchPlaylistInputRef.current.value)}
                />
                <IconButton onClick={() => setSearchPlaylist('')}>
                    <ClearIcon />
                </IconButton>
            </div>
            <div className={cx('data-container')}>
                <DataGrid
                    autoHeight
                    columns={columns}
                    rows={rows}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    sx={{ fontSize: '1.4rem', height: '100%', overflow: 'visible' }}
                    disableSelectionOnClick
                    getRowHeight={() => 'auto'}
                    rowsPerPageOptions={[10]}
                />
            </div>
        </div>
    );
};

export default ManagePlaylist;
