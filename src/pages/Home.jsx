import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PageLayout, SectionLayoutLg } from '../components/SectionLayouts';
import { TitleContainer } from '../components/Containers';

import { SearchButtonInitial } from '../components/Containers';

export default function Home() {

    const navigate = useNavigate();
    const [query, setQuery] = useState({ q: '' });

    const clearInput = () => {
        setSearchInput({ p: '' });
    };

    const handleButtonClick = () => {
        //  const queryVariable = searchInput.p
        // Navigate to the Weather page with the inputted location
        navigate(`/search`);
    }


    return (
        <PageLayout wrapperStyle={`page_content content_start initial_screen_wrapper full_width`}>
            <SectionLayoutLg wrapperStyle={`full_width home_wrapper`} >
                <TitleContainer title={`Welcome to the Weather Whale`} wrapperStyle={`title_main`} />
                <SearchButtonInitial
                    styleClass={`home_button content_center`}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', flexGrow: '0.5' }}
                    text={'Check The Weather'}
                    handleButtonClick={handleButtonClick} />
            </SectionLayoutLg>x
        </PageLayout>
    );
}