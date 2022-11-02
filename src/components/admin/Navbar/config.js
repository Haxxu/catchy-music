import { routes } from '~/config';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';

export const menuOptions = [
    {
        title: 'Home',
        path: routes.home,
        icon: <HomeIcon fontSize='large' />,
    },
    {
        title: 'Profile',
        path: routes.admin_dashboard_profile,
        icon: <AccountBoxIcon fontSize='large' />,
    },
    {
        title: 'Settings',
        path: routes.admin_dashboard_settings,
        icon: <SettingsIcon fontSize='large' />,
    },
];
