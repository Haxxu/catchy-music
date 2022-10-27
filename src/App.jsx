import { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';
import { publicRoutes, privateRoutes } from '~/routes';
import MainLayout from '~/layouts/MainLayout';
import Login from '~/components/Login';
import SignUp from '~/components/SignUp';
import RequireAuth from './components/RequireAuth';

function App() {
    return (
        <Fragment>
            <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = MainLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {/* Private routes */}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = MainLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route key={index} element={<RequireAuth allowedRoles={route.roles} />}>
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        </Route>
                    );
                })}

                {/* Catch All */}
                <Route path='/*' element={<Navigate to='/not-found' replace={true} />} />
            </Routes>
        </Fragment>
    );
}

export default App;
