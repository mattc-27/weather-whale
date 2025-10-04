import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout, SectionLayoutLg } from '../components/layout-containers/SectionLayouts';
import { TitleContainer, SearchButtonInitial } from '../components/layout-containers/Containers';

//import { SearchButtonInitial } from '../components/Containers';
import FeatureHighlights from '../components/FeatureHighlights';
import { Search, Map } from 'lucide-react';

import '../stylesheets/home-styles.css';

export default function Home() {

    const navigate = useNavigate();
    const [query, setQuery] = useState({ q: '' });

    const clearInput = () => {
        setSearchInput({ p: '' });
    };

    const handleGoToSearch = () => navigate('/search');
    const handleGoToParks = () => navigate('/parks'); // adjust route if different


    return (
        <PageLayout wrapperStyle={`full_width home_wrapper hero_overlay`}>
            {/* HERO */}
            <SectionLayoutLg wrapperStyle="full_width home_wrapper hero_overlay initial_screen_wrapper">
                <div className="hero_stack ">
                    <TitleContainer
                        title="Welcome to Weather Whale"
                        wrapperStyle="title_main"
                    />
                    <p className="hero_tagline">
                        Smart forecasts with local insights—for you and your adventures.
                    </p>
                    <div className="hero_ctas">
                        <SearchButtonInitial
                            styleClass="cta_btn cta_btn--lg cta_btn--primary"
                            style={{}}
                            text={<><Search size={18} /> Search Your City</>}
                            handleButtonClick={handleGoToSearch}
                        />
                        <SearchButtonInitial
                            styleClass="cta_btn cta_btn--lg cta_btn--emerald"
                            style={{}}
                            text={<><Map size={18} /> National Park Conditions</>}
                            handleButtonClick={handleGoToParks}
                        />
                    </div>
                </div>
            </SectionLayoutLg>
            <SectionLayoutLg wrapperStyle="full_width feature_section">
                <FeatureHighlights />   {/* will sit below the hero and fill the empty space */}
            </SectionLayoutLg>
        </PageLayout>
    );
}