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
        <PageLayout wrapperStyle="home_wrapper">
            <SectionLayoutLg wrapperStyle="initial_screen_wrapper">
                <div className="hero_overlay">
                    <div className="hero_stack">
                        <TitleContainer title="Welcome to Weather Whale" wrapperStyle="title_main" />

                        <p className="hero_tagline">
                            Smart forecasts with local insights—for you and your adventures.
                        </p>

                        <div className="hero_ctas">
                            <SearchButtonInitial
                                styleClass="cta_btn cta_btn--primary"
                                text={<><Search size={22} /> Search Your City</>}
                                handleButtonClick={handleGoToSearch}
                            />
                            <SearchButtonInitial
                                styleClass="cta_btn cta_btn--emerald"
                                text={<><Map size={22} /> National Park Conditions</>}
                                handleButtonClick={handleGoToParks}
                            />
                        </div>
                    </div>
                </div>
            </SectionLayoutLg>
            <SectionLayoutLg wrapperStyle="feature_section">
                <div className="feature_container">
                    <div className="section_header">
                        <span className="section_pill" style={{ fontWeight: '400' }}>Designed for everyday weather decisions</span>
                        <h2 className="section_title" style={{ fontWeight: '500' }}>Forecast details that actually matter.</h2>
                        <p className="feature_subtitle">
                            Practical weather insights for everyday plans, dog walks, and park trips—no digging required.
                        </p>
                    </div>


                </div>
            </SectionLayoutLg>
            <SectionLayoutLg wrapperStyle="feature_section">
                <FeatureHighlights />
            </SectionLayoutLg>

            {/* ------------- NEW: Deep-dive / feature writeups section ------------- */}
            <section className="deepdive_section" aria-labelledby="deepdive-title">
                <div className="deepdive_container">
                    <div className="deepdive_header">
                        <span className="deepdive_kicker">Built for real plans</span>
                        <h2 id="deepdive-title" className="deepdive_title">
                            Weather that helps you decide.
                        </h2>
                        <p className="deepdive_subtitle">
                            Dog-walk windows, park-ready forecasts, and a clean dashboard—without the clutter.
                        </p>
                    </div>

                    {/* Row 1: Dog Weather (text left, image right) */}
                    <div className="deepdive_row">
                        <div className="deepdive_text">
                            <span className="deepdive_badge">Dog Weather</span>
                            <h3 className="deepdive_rowTitle">Pawcast: comfort-first walk planning</h3>
                            <p className="deepdive_body">
                                “72°” doesn’t tell the whole story. Weather Whale surfaces the factors that change the
                                experience—feels-like temp, sun exposure, wind, and precipitation timing—then turns them
                                into a quick read.
                            </p>
                            <ul className="deepdive_list">
                                <li>Best time windows (cooler / calmer)</li>
                                <li>Wind + gust impact for exposed paths</li>
                                <li>Precip timing you can plan around</li>
                                <li>Comfort flags: heat, chill, slick routes</li>
                            </ul>

                            <div className="deepdive_ctas">
                                <button type="button" className="deepdive_btn deepdive_btn--primary">
                                    Search Your City
                                </button>
                                <button type="button" className="deepdive_btn deepdive_btn--ghost">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="deepdive_media">
                            {/* Replace src with your asset or a screenshot */}
                            <div className="deepdive_mediaFrame" role="img" aria-label="Pawcast preview">
                                <img
                                    className="deepdive_img"
                                    src="https://storage.googleapis.com/weather-whale-assets/e9c94371-e100-40f7-b24f-e841aa56c1bd.png"
                                    alt="Pawcast preview showing best walk window and hourly strip"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: National Parks (image left, text right) */}
                    <div className="deepdive_row deepdive_row--reverse">
                        <div className="deepdive_text">
                            <span className="deepdive_badge">National Parks</span>
                            <h3 className="deepdive_rowTitle">Park-ready forecasts in one snapshot</h3>
                            <p className="deepdive_body">
                                Parks can change fast—especially with elevation and exposure. Get a quick-read view of
                                the conditions that matter before you commit to the drive.
                            </p>
                            <ul className="deepdive_list">
                                <li>Fast park snapshot (today + next few days)</li>
                                <li>Wind + precip timing at a glance</li>
                                <li>Simple “plan for…” notes (layers, shell)</li>
                                <li>Great for day trips and short hikes</li>
                            </ul>

                            <div className="deepdive_ctas">
                                <button type="button" className="deepdive_btn deepdive_btn--emerald">
                                    National Park Conditions
                                </button>
                                <button type="button" className="deepdive_btn deepdive_btn--ghost">
                                    Browse Parks
                                </button>
                            </div>
                        </div>

                        <div className="deepdive_media">
                            <div className="deepdive_mediaFrame" role="img" aria-label="National park conditions preview">
                                <img
                                    className="deepdive_img"
                                    src="https://storage.googleapis.com/weather-whale-assets/c28f709e-bcac-48cb-a8c3-4f2bc26b6277.png"
                                    alt="National parks conditions preview with wind and precipitation emphasis"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Full-width dashboard blurb */}
                    <div className="deepdive_full">
                        <div className="deepdive_fullInner">
                            <div className="deepdive_fullText">
                                <span className="deepdive_badge">Dashboard</span>
                                <h3 className="deepdive_rowTitle">Current conditions, without the noise</h3>
                                <p className="deepdive_body">
                                    A clean “right now” view with feels-like, wind, precipitation, and the next several
                                    hours—so you can make a call quickly and move on.
                                </p>

                                <div className="deepdive_miniGrid">
                                    <div className="deepdive_miniItem">
                                        <div className="deepdive_miniLabel">Right now</div>
                                        <div className="deepdive_miniValue">Temp • Feels-like • Wind</div>
                                    </div>
                                    <div className="deepdive_miniItem">
                                        <div className="deepdive_miniLabel">Next hours</div>
                                        <div className="deepdive_miniValue">Hourly strip • Precip timing</div>
                                    </div>
                                    <div className="deepdive_miniItem">
                                        <div className="deepdive_miniLabel">Next days</div>
                                        <div className="deepdive_miniValue">Daily highs/lows • trend</div>
                                    </div>
                                </div>

                                <div className="deepdive_ctas">
                                    <button type="button" className="deepdive_btn deepdive_btn--primary">
                                        View Dashboard
                                    </button>
                                </div>
                            </div>

                            <div className="deepdive_fullMedia">
                                <div className="deepdive_mediaFrame deepdive_mediaFrame--wide" role="img" aria-label="Dashboard preview">
                                    <img
                                        className="deepdive_img"
                                        src="/images/mock-dashboard.png"
                                        alt="Dashboard preview showing current conditions and hourly forecast"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </PageLayout>

    );
}