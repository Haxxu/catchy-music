import { useState } from 'react';
import { Button, Box, Typography, Modal } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import classnames from 'classnames/bind';
import 'react-confirm-alert/src/react-confirm-alert.css';

import ManageTrackTable from '~/components/admin/Table/ManageTrackTable';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { deleteAlbumUrl, toggleReleaseAlbumUrl } from '~/api/urls/albumsUrl';
import { toast } from 'react-toastify';

const cx = classnames.bind(styles);

const AlbumActionsMenu = ({ handleUpdateData, row }) => {
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openTracksModal, setOpenTracksModal] = useState(false);

    const handleToggleRelease = async () => {
        const { data } = await axiosInstance.put(toggleReleaseAlbumUrl(row._id), {});

        handleUpdateData();
        toast.success(data.message);
    };

    const handleDeleteAlbum = async () => {
        const { data } = await axiosInstance.delete(deleteAlbumUrl(row._id));

        handleUpdateData();
        toast.success(data.message);
    };

    return (
        <div className={cx('menu')}>
            <Button
                variant='contained'
                color='secondary'
                sx={{ minWidth: '100px' }}
                onClick={() => setOpenDetailModal(true)}
            >
                Detail
            </Button>
            <Button
                variant='contained'
                color='success'
                sx={{ minWidth: '100px' }}
                onClick={() => setOpenTracksModal(true)}
            >
                Tracks
            </Button>
            <Button
                variant='contained'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: 'Confirm to toggle release',

                        message: 'Are you sure to do this.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: handleToggleRelease,
                            },
                            {
                                label: 'No',
                            },
                        ],
                    })
                }
            >
                {row.isReleased ? 'Unrelease' : 'Release'}
            </Button>
            <Button
                variant='contained'
                color='error'
                sx={{ minWidth: '100px' }}
                onClick={() =>
                    confirmAlert({
                        title: 'Confirm to delete this album',

                        message: 'Are you sure to do this.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: handleDeleteAlbum,
                            },
                            {
                                label: 'No',
                            },
                        ],
                    })
                }
            >
                Delete
            </Button>
            <Modal
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                aria-labelledby='modal-album-detail-title'
                aria-describedby='modal-album-detail-description'
                sx={{
                    zIndex: '30',
                }}
            >
                <Box
                    sx={{
                        color: 'var(--text-primary)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: 500,
                        bgcolor: 'var(--background2-color)',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography
                        id='modal-album-detail-title'
                        variant='h6'
                        component='h2'
                        sx={{ mt: 2, mb: 4, fontSize: '2rem' }}
                    >
                        Album detail
                    </Typography>
                    <div
                        id='modal-album-detail-description'
                        style={{
                            mt: 2,
                            fontSize: '1.6rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <p style={{ marginBottom: '5px' }}>Name: {row.name}</p>
                        <p style={{ marginBottom: '5px' }}>Genre: {row.genres}</p>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openTracksModal}
                onClose={() => setOpenTracksModal(false)}
                aria-labelledby='modal-tracks-title'
                aria-describedby='modal-tracks-description'
            >
                <Box
                    sx={{
                        color: 'var(--text-primary)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: '65%',
                        minHeight: '65%',
                        bgcolor: 'var(--background2-color)',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography
                        id='modal-tracks-title'
                        variant='h6'
                        component='h2'
                        sx={{ mt: 2, mb: 4, fontSize: '2rem' }}
                    >
                        Tracks
                    </Typography>
                    <div
                        id='modal-tracks-description'
                        style={{
                            width: '100%',
                        }}
                    >
                        <ManageTrackTable
                            type='album'
                            id={row._id}
                            tracks={row.tracks}
                            handleUpdateData={handleUpdateData}
                        />
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default AlbumActionsMenu;
