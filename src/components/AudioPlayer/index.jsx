import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
// import ReactAudioPlayer from 'react-audio-player';

import Like from '~/components/Like';
import TrackProgressBar from '~/components/TrackProgressBar';
import { fancyTimeFormat } from '~/utils/Format';
import styles from './styles.scoped.scss';
import trackSrc from '~/assets/audio/alone-alan-walker.m4a';
import VolumeControl from '../VolumeControl';

const cx = classNames.bind(styles);

const artists = [{ name: 'Alan Walker', id: 'fhdslfkdsa32' }, { name: 'Imagine Dragons', id: 'fhdslfkdsa32' }];

const AudioPlayer = () => {
    const [repeatMode, setRepeatMode] = useState('none');
    const [shuffle, setShuffle] = useState(false);
    const [playMode, setPlayMode] = useState('pause');
    const [volume, setVolume] = useState(25);
    const [percentage, setPercentage] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef();

    const handleTogglePlay = async () => {
        setPlayMode((prev) => (prev === 'play' ? 'pause' : 'play'));
    };

    const handleToggleShuffle = async () => {
        setShuffle((prev) => !prev);
    };

    const handleToggleRepeatMode = async () => {
        const mode = ['none', 'repeat', 'repeat-one'];
        let index = mode.indexOf(repeatMode);
        if (index === 2) {
            index = 0;
        } else {
            index = index + 1;
        }
        setRepeatMode(mode[index]);
    };

    const onChangeAudio = (e) => {
        const audio = audioRef.current;
        audio.currentTime = (audio.duration / 100) * e.target.value;
        setPercentage(e.target.value);
    };

    const onChangeVolume = (e) => {
        setVolume(Math.round(e.target.value));
    };

    const handleEndedTrack = (e) => {
        if (repeatMode === 'repeat-one' && playMode === 'play') {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const getCurrDuration = (e) => {
        const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2);
        const time = e.currentTarget.currentTime;

        setPercentage(+percent);
        setCurrentTime(time.toFixed(2));
    };

    useEffect(() => {
        if (playMode === 'play') {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

        audioRef.current.volume = volume / 100.0;
    }, [playMode, volume]);

    return (
        <div className={cx('container')}>
            <audio
                src={trackSrc}
                ref={audioRef}
                onTimeUpdate={getCurrDuration}
                onLoadedData={(e) => {
                    setDuration(e.currentTarget.duration.toFixed(2));
                }}
                onEnded={handleEndedTrack}
            />
            <div className={cx('start')}>
                <div className={cx('image')}>
                    <Avatar src='' alt='Tac' variant='square' sx={{ width: '40px', height: '40px' }} />
                </div>
                <div className={cx('info')}>
                    <div className={cx('name')}>
                        <a href='sfd'>Alone</a>
                    </div>
                    <div className={cx('artists')}>
                        {artists.map((artist, index) => {
                            return (
                                <span key={index}>
                                    {index !== 0 ? ', ' : ''}
                                    <a href='fsd'>{artist.name}</a>
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className={cx('like')}>
                    <Like />
                </div>
            </div>
            <div className={cx('center')}>
                <div className={cx('audio-controls')}>
                    {/* <ReactAudioPlayer
                        src={trackSrc}
                        controls
                        style={{ display: 'none' }}
                        onPause={playMode === 'pause'}
                        onPlay={(e) => {
                            if (playMode === 'play') {
                                e.target.play();
                            } else {
                                e.target.pause();
                            }
                        }}
                        ref={audioRef}
                    /> */}
                    {/* <input type='range' min='0' max='10' value={volume} onChange={(e) => setVolume(e.target.value)} /> */}
                    <IconButton className={cx('control-btn')} onClick={handleToggleShuffle}>
                        <ShuffleIcon className={cx('control', { active: shuffle })} />
                    </IconButton>
                    <IconButton className={cx('control-btn')}>
                        <SkipPreviousIcon className={cx('control')} />
                    </IconButton>
                    <IconButton className={cx('play-btn')} onClick={handleTogglePlay}>
                        {playMode === 'play' ? (
                            <PauseCircleIcon className={cx('control')} />
                        ) : (
                            <PlayCircleIcon className={cx('control')} />
                        )}
                    </IconButton>
                    <IconButton className={cx('control-btn')}>
                        <SkipNextIcon className={cx('control')} />
                    </IconButton>
                    <IconButton className={cx('control-btn')} onClick={handleToggleRepeatMode}>
                        {repeatMode === 'repeat-one' ? (
                            <RepeatOneIcon className={cx('control', 'active')} />
                        ) : (
                            <RepeatIcon className={cx('control', { active: repeatMode === 'repeat' })} />
                        )}
                    </IconButton>
                </div>
                <div className={cx('track-progress')}>
                    <span className={cx('timer')}>{fancyTimeFormat(currentTime)}</span>
                    <TrackProgressBar percentage={percentage} onChangeAudio={onChangeAudio} />
                    <span className={cx('timer')}>{fancyTimeFormat(duration)}</span>
                </div>
            </div>
            <div className={cx('end')}>
                <div className={cx('lyric')}>
                    <IconButton className={cx('control-btn')}>
                        <MicExternalOnIcon className={cx('control')} />
                    </IconButton>
                </div>
                <div className={cx('queue')}>
                    <IconButton className={cx('control-btn')}>
                        <QueueMusicIcon className={cx('control')} />
                    </IconButton>
                </div>
                <VolumeControl volume={volume} onChangeVolume={onChangeVolume} />
            </div>
        </div>
    );
};

export default AudioPlayer;
