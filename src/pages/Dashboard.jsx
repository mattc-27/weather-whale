import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { SectionLayoutMain, SectionLayoutLg, ConditionsSection, ConditionsContent, IconContainer } from '../components/SectionLayouts';

import { PageLayout } from '../components/SectionLayouts';
import { TitleContainerLocation } from '../components/Containers';

import { WiFog } from "react-icons/wi";
import { FaTemperatureArrowDown, FaTemperatureArrowUp } from "react-icons/fa6";
import { CiDroplet } from "react-icons/ci";
import { LiaWindSolid, LiaCloudSunSolid } from "react-icons/lia";

import { toasterContainer, toasterStyle } from '../components/Toasters';
import toast, { Toaster } from 'react-hot-toast';

import { useMobile, useBreakpoint } from '../hooks/useMobile';

import DogWeather from '../components/DogWeather';

//  import { HourlyTable } from '../components/HourlyTable';
// import { CardConditions } from '../components/Cards';
const HourlyTable = lazy(() => import('../components/HourlyTable'))
const CardConditions = lazy(() => import('../components/Cards'))

import { fetchWeather } from '../util/weather';
import { WeatherContext } from '../context/WeatherContext';


export default function Dashboard() {

    const navigate = useNavigate();

    const mobile = useMobile(); // default 730px
    // const iconSize = mobile ? 25 : 35;  // Helper function
    const breakpoint = useBreakpoint();

    if (breakpoint === 'xsmall') {
        const iconSize = 125
        // very small screen like older iPhones
    }
    if (breakpoint === 'small') {
        const iconSize = 120
        // normal mobile
    }
    if (breakpoint === 'medium') {
        // tablets
        const iconSize = 120
    }
    if (breakpoint === 'large') {
        // desktop
        const iconSize = 120
    }

    const [searchParams, setSearchParams] = useSearchParams();

    const [userCoords, setUserCoords] = useState(null);

    const query = searchParams.get('q'); // no default yet

    const { currentConditions, setCurrentConditions } = useContext(WeatherContext);


    async function fetchData() {
        try {
            const response = await toast.promise(fetchWeather(query), {
                loading: 'loading', //`${loadingMsg.text} 🐳`,
                success: 'success', //`${loadingMsg.text} 🐳`,
                error: 'Error when fetching'
            }, {
                style: toasterStyle,
            });
            setCurrentConditions(response);
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        if (!query) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const coords = `${lat},${lon}`;

                    // Update URL to include coordinates
                    setSearchParams({ q: coords });
                    setUserCoords(coords);
                },
                (error) => {
                    console.log('Geolocation error or denied:', error);
                    // If they deny, set q=Denver
                    setSearchParams({ q: 'Denver' });
                }
            );
        }
    }, []); // <-- only runs on first page load


    useEffect(() => {
        console.log('getting weather')
        if (query) {
            fetchData().catch(console.error);
        }
    }, [query]);


    return (
        <PageLayout wrapperStyle={`page_content content_start`} style={{ height: 'auto' }} >
            {currentConditions &&
                <>
                    <SectionLayoutMain wrapperStyle={`weather_main`} >
                        <ConditionsSection wrapperStyle={`weather_current`}>
                            <SectionLayoutLg wrapperStyle={`section_content`}>
                                <ConditionsContent
                                    wrapperStyle={`col main_text`}
                                    text={`${currentConditions.temp_f}°F`} />
                                <ConditionsContent
                                    wrapperStyle={`col main_text`}
                                    text={currentConditions.condition.text} />
                                <TitleContainerLocation
                                    wrapperStyle={`row items_center location_title`}
                                    searchLocation={currentConditions.searchLocation}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '90%', position: 'relative' }}>
                                    <DogWeather
                                        dogWeather={currentConditions.dogComfort}
                                    />
                                </div>

                                <IconContainer wrapperStyle={`current_icon`}
                                    icon={<currentConditions.formatIcon.IconComponent
                                        size={breakpoint === 'xsmall' ? 160 : 150}
                                        style={{ color: '#757575' }} />}
                                />
                            </SectionLayoutLg>



                        </ConditionsSection>
                        {/* */}
                        <Suspense fallback={<div>Loading data...</div>}>
                            <SectionLayoutMain wrapperStyle={`row_flex content_even items_center full_width`} >
                                <ConditionsSection wrapperStyle={`conditions_current`} >
                                    <CardConditions
                                        cardStyle={`category_card card_text sm`}
                                        item={`${currentConditions.forecastday[0].day.maxtemp_f}°F`}
                                        icon={<FaTemperatureArrowUp size={mobile ? 25 : 30} color={'#d56c6c'} />}
                                    />
                                    <CardConditions
                                        cardStyle={`category_card card_text sm`}
                                        item={`${currentConditions.forecastday[0].day.mintemp_f}°F`}
                                        icon={<FaTemperatureArrowDown size={mobile ? 25 : 30} color={'#8098c9'} />}
                                    />
                                    <CardConditions
                                        cardStyle={`category_card card_text`}
                                        item={`${currentConditions.cloud}%`}
                                        icon={<LiaCloudSunSolid size={mobile ? 30 : 30} color={'#878787'} />}
                                    />
                                    <CardConditions
                                        cardStyle={`category_card card_text`}
                                        item={`${currentConditions.wind_mph}` + "mph, " + `${currentConditions.wind_dir}`}
                                        icon={<LiaWindSolid size={mobile ? 25 : 30} color={'#878787'} />}
                                    />
                                    <CardConditions
                                        cardStyle={`category_card card_text`}
                                        item={`${currentConditions.vis_miles}mi`}
                                        icon={<WiFog size={mobile ? 30 : 30} color={'#878787'} />}
                                    />
                                    <CardConditions
                                        cardStyle={`category_card card_text sm`}
                                        item={`${currentConditions.humidity}%`}
                                        icon={<CiDroplet size={mobile ? 25 : 30} color={'#878787'} />}
                                    />
                                </ConditionsSection>
                                <ConditionsSection wrapperStyle={`row_flex content_even items_center full_width main_text`}
                                    style={{
                                        position: 'relative',
                                        'zIindex': 5000
                                    }}>
                                    <HourlyTable currentConditions={currentConditions} style={{
                                        position: 'relative',
                                        'zIindex': 5000
                                    }} />
                                </ConditionsSection>

                            </SectionLayoutMain>

                            {/*         <TimelineSection
                                hourlyData={currentConditions.forecastday[0].hour}
                                sunriseTime={currentConditions.forecastday[0].astro.sunrise}
                                sunsetTime={currentConditions.forecastday[0].astro.sunset}
                            />*/}
                        </Suspense>
                    </SectionLayoutMain>
                </>
            }
        </PageLayout >
    );
}