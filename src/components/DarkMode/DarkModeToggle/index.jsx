import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import { selectCurrentTheme, toggleTheme } from '~/redux/userInterfaceSlice';

const DarkModeToggle = ({ children, ...rest }) => {
    const theme = useSelector(selectCurrentTheme);
    const dispatch = useDispatch();

    const handleToggletheme = () => {
        dispatch(toggleTheme());
    };

    return (
        <Button onClick={handleToggletheme} {...rest}>
            {theme}
            {children}
        </Button>
    );
};

export default DarkModeToggle;
