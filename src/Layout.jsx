import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Header, Footer } from './components/LayoutComponents';
import { toasterContainer, toasterStyle } from './components/Toasters';
import toast, { Toaster } from 'react-hot-toast';

export default function Layout() {

    return (
        <div style={{
            display: 'block',
            height: 'auto',
            overflow: 'visible',
        }}>
            <Header />
            <Toaster containerStyle={toasterContainer} />
            <div className='container'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}