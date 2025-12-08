import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components/layout-containers/LayoutComponents';
import { toasterContainer, toasterStyle } from './components/Toasters';
import toast, { Toaster } from 'react-hot-toast';

export default function Layout() {

    return (
        <div className="layout_root">
            <Header />
            <Toaster containerStyle={toasterContainer} />
            <div className='container'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}