import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import { Button, IconButton, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';

import styles from './styles.scoped.scss';
import { routes } from '~/config';
import { useAuth, useDebounce } from '~/hooks';
import axiosInstance from '~/api/axiosInstance';
import { getArtistTracksUrl, getArtistAlbumsUrl } from '~/api/urls/artistsUrl';
import { fancyTimeFormat } from '~/utils/Format';
import { deleteTrackUrl } from '~/api/urls/tracksUrls';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const ManageAlbum = () => {
    const [searchAlbum, setSearchAlbum] = useState('');
    const [rows, setRows] = useState([]);
    const [update, setUpdate] = useState(false);

    const searchAlbumInputRef = useRef();
    const debouncedValue = useDebounce(searchAlbum, 500);
    const { userId } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance(getArtistAlbumsUrl(userId), {
                params: { search: searchAlbum, context: 'detail' },
            });
            setRows(data.data);
            console.log(rows);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, userId, update]);

    const handleDeleteTrack = async (id) => {
        try {
            const { data } = await axiosInstance.delete(deleteTrackUrl(id));
            setUpdate((prev) => !prev);
            toast.success(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            field: 'image',
            headerName: t('Image'),
            width: 35,
            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.row.image} sx={{ width: 30, height: 30 }} variant='square' />
            ),
        },
        {
            field: 'name',
            headerName: t('Name'),
            flex: 1,
        },
        {
            field: 'tracks',
            headerName: t('Tracks'),
            flex: 1,
            valueGetter: (params) => params.row.tracks.length,
        },
        {
            field: 'type',
            headerName: t('Type'),
            flex: 1,
        },
        {
            field: 'saved',
            headerName: t('Saved'),
        },
        {
            field: 'createdAt',
            headerName: t('Created At'),
            flex: 1,
            valueGetter: (params) => Moment(params.row.createdAt).format('DD-MM-YYYY'),
        },
        {
            field: 'releaseDate',
            headerName: t('Release Date'),
            flex: 1,
            valueGetter: (params) => Moment(params.row.releaseDate).format('DD-MM-YYYY'),
        },
        {
            field: 'actions',
            headerName: t('Actions'),
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <Link to={routes.artist_manageTrack + `/${params.row._id}`}>
                        <IconButton>
                            <EditIcon fontSize='large' />
                        </IconButton>
                    </Link>
                    <IconButton
                        className={cx('delete-btn')}
                        color='error'
                        onClick={() =>
                            confirmAlert({
                                title: t('Confirm to delete this album'),

                                message: t('Are you sure to do this.'),
                                buttons: [
                                    {
                                        label: t('Yes'),
                                        onClick: () => handleDeleteTrack(params.row._id),
                                    },
                                    {
                                        label: t('No'),
                                    },
                                ],
                            })
                        }
                    >
                        <DeleteIcon fontSize='large' />
                    </IconButton>
                </div>
            ),
            // <ActionMenu handleUpdateData={handleUpdateData} type='track' row={params.row} />
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>My Albums</h1>
                <Link to={routes.artist_manageAlbum + '/new-album'}>
                    <Button
                        size='large'
                        color='secondary'
                        variant='contained'
                        startIcon={<AddIcon />}
                        sx={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                        }}
                    >
                        Add new album
                    </Button>
                </Link>
            </div>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder='Search for my album'
                    value={searchAlbum}
                    ref={searchAlbumInputRef}
                    onChange={() => setSearchAlbum(searchAlbumInputRef.current.value)}
                />
                <IconButton onClick={() => setSearchAlbum('')}>
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

export default ManageAlbum;
