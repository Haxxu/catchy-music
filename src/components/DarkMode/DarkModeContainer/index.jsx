import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentTheme } from '~/redux/userInterfaceSlice';

const DarkModeContainer = ({ children }) => {
    const theme = useSelector(selectCurrentTheme);

    return <div data-theme={theme}>{children}</div>;
};

export default DarkModeContainer;
