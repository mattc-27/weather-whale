import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout, SectionLayoutLg } from './layout-containers/SectionLayouts';
import { TitleContainer, SearchButtonInitial } from './layout-containers/Containers';
import { PawPrint, CloudSunRain, Mountain } from 'lucide-react';

import '../stylesheets/main.css';

// NEW – lightweight feature section in same file (you can extract later)
export default function FeatureHighlights() {
    return (
        <section className="feature_section" aria-label="Feature highlights">
            <div className="feature_inner">
                <div className="feature_item">
                    <div className="feature_icon" aria-hidden="true">
                        <PawPrint />
                    </div>
                    <h3>Pawcast</h3>
                    <p>Pet-friendly comfort tips tailored to today’s weather.</p>
                </div>
                <div className="feature_item">
                    <div className="feature_icon" aria-hidden="true">
                        <CloudSunRain />
                    </div>
                    <h3>Hourly & Daily</h3>
                    <p>Swipeable hourly timeline with temp and precip trends.</p>
                </div>
                <div className="feature_item">
                    <div className="feature_icon" aria-hidden="true">
                        <Mountain />
                    </div>
                    <h3>National Parks</h3>
                    <p>Conditions at your favorite parks—one tap away.</p>
                </div>
            </div>
        </section>
    );
}
