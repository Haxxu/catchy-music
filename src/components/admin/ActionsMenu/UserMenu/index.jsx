import { useState } from 'react';
import { Button, Box, Typography, Modal } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import classnames from 'classnames/bind';
import 'react-confirm-alert/src/react-confirm-alert.css';

import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { freezeUserUrl, unfreezeUserUrl, verifyArtistUrl, unverifyArtistUrl } from '~/api/urls/usersUrl';
import { toast } from 'react-toastify';

const cx = classnames.bind(styles);

const UserActionsMenu = ({ handleUpdateData, row }) => {
    const [openDetailModal, setOpenDetailModal] = useState(false);

    const handleFreezeUser = async () => {
        const { data } = await axiosInstance.patch(freezeUserUrl + `${row._id}`, {});

        handleUpdateData();
        toast.success(data.message);
    };

    const handleUnfreezeUser = async () => {
        const { data } = await axiosInstance.patch(unfreezeUserUrl + `${row._id}`, {});

        handleUpdateData();
        toast.success(data.message);
    };

    const handleVerifyArtist = async () => {
        const { data } = await axiosInstance.post(verifyArtistUrl + `${row._id}`, {});

        handleUpdateData();
        toast.success(data.message);
    };
    const handleUnverifyArtist = async () => {
        const { data } = await axiosInstance.post(unverifyArtistUrl + `${row._id}`, {});

        handleUpdateData();
        toast.success(data.message);
    };

    return (
        <div className={cx('menu')}>
            <Button
                variant='contained'
                color='primary'
                sx={{ minWidth: '100px' }}
                onClick={() => setOpenDetailModal(true)}
            >
                Detail
            </Button>
            {row.type === 'user' ? (
                <Button
                    variant='contained'
                    color='secondary'
                    sx={{ minWidth: '100px' }}
                    onClick={() =>
                        confirmAlert({
                            title: 'Confirm to verify this user to artist',

                            message: 'Are you sure to do this.',
                            buttons: [
                                {
                                    label: 'Yes',
                                    onClick: handleVerifyArtist,
                                },
                                {
                                    label: 'No',
                                },
                            ],
                        })
                    }
                >
                    Verify Artist
                </Button>
            ) : (
                <Button
                    variant='contained'
                    color='secondary'
                    sx={{ minWidth: '100px' }}
                    onClick={() =>
                        confirmAlert({
                            title: 'Confirm to unverify this artist back to user',
                            message: 'Are you sure to do this.',
                            buttons: [
                                {
                                    label: 'Yes',
                                    onClick: handleUnverifyArtist,
                                },
                                {
                                    label: 'No',
                                },
                            ],
                        })
                    }
                >
                    Unverify Artist
                </Button>
            )}
            {row.status === 'actived' ? (
                <Button
                    variant='contained'
                    color='info'
                    sx={{ minWidth: '100px' }}
                    onClick={() =>
                        confirmAlert({
                            title: 'Confirm to freeze this user',
                            message: 'Are you sure to do this.',
                            buttons: [
                                {
                                    label: 'Yes',
                                    onClick: handleFreezeUser,
                                },
                                {
                                    label: 'No',
                                },
                            ],
                        })
                    }
                >
                    Freeze
                </Button>
            ) : (
                <Button
                    variant='contained'
                    color='info'
                    sx={{ minWidth: '100px' }}
                    onClick={() =>
                        confirmAlert({
                            title: 'Confirm to unfreeze this user',
                            message: 'Are you sure to do this.',
                            buttons: [
                                {
                                    label: 'Yes',
                                    onClick: handleUnfreezeUser,
                                },
                                {
                                    label: 'No',
                                },
                            ],
                        })
                    }
                >
                    Unfreeze
                </Button>
            )}
            <Modal
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                aria-labelledby='modal-user-menu-title'
                aria-describedby='modal-user-menu-description'
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
                        id='modal-user-menu-title'
                        variant='h6'
                        component='h2'
                        sx={{ mt: 2, mb: 4, fontSize: '2rem', textTransform: 'capitalize' }}
                    >
                        {row.type} detail
                    </Typography>
                    <div
                        id='modal-user-menu-description'
                        style={{
                            mt: 2,
                            fontSize: '1.6rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {Object.entries(row).map(([key, value]) => (
                            <p style={{ fontSize: '1.6rem', marginBottom: '5px' }} key={key}>
                                {key}: {value}
                            </p>
                        ))}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default UserActionsMenu;
