import { routes } from '~/config';
// Layouts
import MainLayout from '~/layouts/MainLayout';
// Component
import Login from '~/components/Login';
import SignUp from '~/components/SignUp';
import UnAuthorized from '~/components/UnAuthorized';
import NotFound from '~/components/NotFound';

const publicRoutes = [
    {
        path: routes.notFound,
        component: NotFound,
        layout: null,
    },
    {
        path: routes.login,
        component: Login,
        layout: null,
    },
    {
        path: routes.signup,
        component: SignUp,
        layout: null,
    },
    {
        path: routes.unAuthorized,
        component: UnAuthorized,
        layout: null,
    },
];

export default publicRoutes;
