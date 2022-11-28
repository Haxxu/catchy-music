import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import { routes } from '~/config';
import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const Sidebar = () => {
    const [playlists, setPlaylists] = useState([]);

    const { context, isPlaying } = useSelector((state) => state.audioPlayer);
    const { playlistsInSidebarState } = useSelector((state) => state.updateState);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getSavedPlaylistsUrl);
            setPlaylists(data.data);
        };

        fetchData().catch(console.error);
    }, [playlistsInSidebarState]);

    return (
        <div className={cx('container')}>
            <div className={cx('brand')}>
                <h3>CATCHY MUSIC</h3>
            </div>
            <div className={cx('navigation')}>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} end to={routes.home}>
                    <HomeIcon />
                    <span>Home</span>
                </NavLink>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.search}>
                    <SearchIcon />
                    <span>Search</span>
                </NavLink>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.library}>
                    <LibraryMusicIcon />
                    <span>Library</span>
                </NavLink>
                <div className={cx('create-playlist-btn link')}>
                    <AddBoxIcon />
                    <span>Create playlist</span>
                </div>
                <NavLink className={({ isActive }) => cx('link', { active: isActive })} to={routes.likedTracks}>
                    <FavoriteIcon />
                    <span>Liked Tracks</span>
                </NavLink>
            </div>
            <div className={cx('playlist-container')}>
                {playlists.map(({ playlist }, index) => (
                    <NavLink
                        key={index}
                        className={({ isActive }) =>
                            cx('link', {
                                active: isActive,
                            })
                        }
                        to={'/playlist/' + playlist._id}
                    >
                        <div className={cx('name')}>
                            <span>{playlist.name}</span>
                        </div>

                        {context &&
                            context?.contextType === 'playlist' &&
                            context?.contextId === playlist._id &&
                            isPlaying && <VolumeUpIcon />}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
