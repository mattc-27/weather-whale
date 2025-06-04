import React from 'react';
import { SearchButtonInitial } from '../components/Containers';
import { PageLayout, SectionLayoutMain, SectionLayoutLg, TextBlock } from '../components/SectionLayouts';
import { TitleContainer } from '../components/Containers';
import whale_cloud from '../assets/whale_cloud.png';
import { useMobile } from '../hooks/useMobile';

export default function About() {

    const mobile = useMobile(); // default 740px

    const handleButtonClick = () => {
        // Navigate to the Weather page with the inputted location
        navigate(`/search`);
    }

    const imgMobile = {
        position: 'absolute',
        zIndex: '5000',
        height: '180px',
        width: '180px',
        top: '50%',
        right: '5%',
        borderRadius: '5px',
        boxShadow: '0px 0px 5px 1px rgba(82, 82, 82, 0.23)'
    }
    const imgWeb = {
        position: 'unset',
        height: '250px',
        width: '250px',
        alignSelf: 'center',
        borderRadius: '5px',
        boxShadow: '0px 0px 5px 1px rgba(82, 82, 82, 0.23)'
    }

    return (

        <PageLayout wrapperStyle={`page_content`} >
            <SectionLayoutMain wrapperStyle={`about_main`} style={{ height: 'auto', padding: '1rem 0rem' }}>
                <SectionLayoutLg wrapperStyle={`row content_even items_center body_text full_width`} style={{ flexGrow: '1', flexWrap: 'wrap', position: 'relative', zIndex: '999999' }}>
                    <TitleContainer title={`About Weather Whale`} wrapperStyle={`title_about`} />
                    <TextBlock wrapperStyle={`flex_col body_text`} style={{ position: 'relative', zIndex: '999999', maxWidth: mobile ? '98%' : '49%' }}>
                        <p style={{ whiteSpace: 'pre-line' }}  >
                            Weather Whale started as a small project — something simple to practice with, build and improve over time, share.
                            Under the hood, it's a straightfoward app built with React.js and pulls basic weather info for cities you search.
                            An uncluttered take on weather — just what you need, no fog.
                        </p>
                        <p style={{ whiteSpace: 'pre-line' }}  >
                            Weather Whale got its name from a memory of spotting a cloud shaped like a whale — and because whales are just awesome creatures.
                        </p>
                        <p>
                            The site is intentionally minimal by design, but I'm exploring ways to add data visualizations (with tools like <a href="https://github.com/d3/d3">d3.js</a>) to help you spot patterns, trends, and get a little more out of the forecasts.
                            Like everything here, it’ll grow over time — one update, one wave at a time.
                        </p>
                    </TextBlock>
                    <img
                        style={mobile ? imgMobile : imgWeb}
                        src={whale_cloud}
                    />
                </SectionLayoutLg>
                <SectionLayoutLg wrapperStyle={`col content_even items_center body_text full_width`} style={{ flexGrow: '1', flexWrap: 'wrap', padding: '1rem 0rem' }}>
                    <TextBlock wrapperStyle={`flex_col body_text`} style={{ maxWidth: mobile ? '98%' : '80%' }}>
                        <h2>🐋 A Quick Note on Whale Conservation:</h2>
                        <p>
                            Since we borrowed the whale for our name, it felt right to mention the real ones too. Whales play a huge role in ocean health, and they face serious challenges from climate change, ship traffic, and pollution. Even small acts of awareness help.
                            If you're curious, take a little time to learn about conservation efforts at the <a href="https://us.whales.org/"> Whale and Dolphin Conservation.</a>
                        </p>
                    </TextBlock>
                    <TextBlock wrapperStyle={`flex_col content_center items_center body_text`} style={{ width: '100%' }}>
                        <div className='flex_col body_text md' style={{ margin: '1%' }}>
                            <h3 style={{ whiteSpace: 'pre-line' }} >
                                Thanks for visiting —
                                <br />and keep an eye on the skies (and the seas)!
                            </h3>
                        </div>
                        <div className='row items_center content_center' style={{ margin: ' 0%', width: '100%', maxWidth: '98%' }}>
                            <SearchButtonInitial
                                styleClass={`return_button`}
                                text={'Return To Weather Dashboard'}
                                handleButtonClick={handleButtonClick} />
                        </div>
                    </TextBlock>
                </SectionLayoutLg>
            </SectionLayoutMain>
        </PageLayout>
    );
}