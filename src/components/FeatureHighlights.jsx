import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout, SectionLayoutLg } from './layout-containers/SectionLayouts';
import { TitleContainer, SearchButtonInitial } from './layout-containers/Containers';
import { PawPrint, CloudSunRain, Mountain } from 'lucide-react';

import '../stylesheets/main.css';

// NEW – lightweight feature section in same file (you can extract later)
export default function FeatureHighlights() {
    return (
        <div className="feature_inner">
            <div className="feature_card">
                <div className="feature_iconWrap feature_iconWrap--pawcast" aria-hidden="true">
                    <PawPrint className='feature_icon' />
                </div>
                <h3>Pawcast</h3>
                <p>Pet-friendly comfort tips tailored to today’s weather.</p>
            </div>

            <div className="feature_card">
                <div className="feature_iconWrap feature_iconWrap--hourly" aria-hidden="true">
                    <CloudSunRain className='feature_icon' />
                </div>
                <h3>Hourly & Daily</h3>
                <p>Swipeable hourly timeline with temp and precip trends.</p>
            </div>
            <div className="feature_card">
                <div className="feature_iconWrap feature_iconWrap--parks" aria-hidden="true">
                    <Mountain className='feature_icon' />
                </div>
                <h3>National Parks</h3>
                <p>Conditions at your favorite parks—one tap away.</p>
            </div>
            {/*
            <div className="feature_card">
                <div className="feature_iconWrap feature_iconWrap--hourly" aria-hidden="true">
                    <Mountain className='feature_icon' />
                    <h3>National Parks</h3>
                    <p>Conditions at your favorite parks—one tap away.</p>
                </div>
            </div>*/}
        </div>
    );
}