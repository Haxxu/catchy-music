import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    Table,
    IconButton,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    CircularProgress,
    Grid,
} from '@mui/material';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import AlbumItem from '~/components/AlbumItem';
import styles from './styles.scoped.scss';
import { useAuth } from '~/hooks';
import { playTrack, pauseTrack } from '~/api/audioPlayer';
import axiosInstance from '~/api/axiosInstance';
import { updateTrack } from '~/redux/audioPlayerSlice';
import Like from '~/components/Like';
import { timeAgoFormat, fancyTimeFormat } from '~/utils/Format';
import TrackMenu from '~/components/TrackMenu';
import unknownPlaylistImg from '~/assets/images/playlist_unknown.jpg';
import { getAlbumByIdUrl } from '~/api/urls/albumsUrl';
import { getArtistAlbumsUrl } from '~/api/urls/artistsUrl';
import AlbumMenu from '~/components/AlbumMenu';

const cx = classNames.bind(styles);

const User = () => {
    const [album, setAlbum] = useState(null);
    const [user, setUser] = useState(null);
    const [publicPlaylists, setPublicPlaylists] = useState([]);
    const { id } = useParams();
    const { userId } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAlbum = async () => {
            const { data } = await axiosInstance.get(getAlbumByIdUrl(id));
            setAlbum(data.data);
            // console.log(album.data);
            return data.data?.owner?._id;
        };

        fetchAlbum().catch(console.error);
    }, [id]);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('image')}>
                    <Avatar
                        className={cx('image')}
                        variant='square'
                        src={album?.image.trim() === '' ? unknownPlaylistImg : album?.image}
                        alt={album?.name}
                        sx={{ width: '240px', height: '240px' }}
                    />
                </div>
                <div className={cx('info')}>
                    <h2 className={cx('type')}>{album?.type === 'single' ? 'SINGLE' : 'ALBUM'}</h2>
                    <span className={cx('name')}>{album?.name}</span>
                    {/* <div className='description'>{album?.description}</div> */}
                    <div className={cx('detail')}>
                        <Link to={`/artist/${album?.owner?._id}`} className={cx('owner-name')}>
                            {album?.owner?.name}
                        </Link>
                        <span className={cx('year')}>{album?.year}</span>
                        <span className={cx('total-saved')}>{album?.saved} likes</span>
                        <span className={cx('total-tracks')}>{album?.tracks?.length} tracks. </span>
                        <span className={cx('total-time')}>
                            Total time:{' '}
                            {fancyTimeFormat(album?.tracks?.reduce((sum, item) => sum + item.track.duration, 0))}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('actions')}>
                <div className={cx('action')}>
                    <Like type='album' size='large' albumId={album?._id} />
                </div>
            </div>
            <div className={cx('content')} />

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Public Playlist</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {/* {moreAlbums?.length !== 0 &&
                            moreAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))} */}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default User;
