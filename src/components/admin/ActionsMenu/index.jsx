import React, { useState } from 'react';
import classNames from 'classnames/bind';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import styles from './styles.scoped.scss';
import UserActionsMenu from './UserMenu';

const cx = classNames.bind(styles);

const ActionMenu = ({ type, handleUpdateData, row }) => {
    const [menu, setMenu] = useState(false);

    return (
        <div className={cx('container')}>
            <div className={cx('icon-container')} onClick={() => setMenu(!menu)}>
                {menu ? (
                    <MoreHorizIcon sx={{ fontSize: '1.2rem', fontWeight: '700' }} />
                ) : (
                    <MoreVertIcon sx={{ fontSize: '1.2rem', fontWeight: '700' }} />
                )}
            </div>
            {menu && type === 'user' && <UserActionsMenu handleUpdateData={handleUpdateData} row={row} />}
        </div>
    );
};

export default ActionMenu;
