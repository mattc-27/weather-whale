import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "./components/layout-containers/LayoutComponents";
import { toasterContainer } from "./components/Toasters";
import { Toaster } from "react-hot-toast";

export default function Layout() {
    return (
        <div className="layout_root">
            <Header />

            <Toaster containerStyle={toasterContainer} />

            <main className="app_main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}