import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    PageLayout,
    SectionLayoutLg,
} from "../components/layout-containers/SectionLayouts";

import {
    AtmosphericHero,
    EditorialSection,
    FutureVisionSection,
} from "../components/home/HomeSections";

import { fetchWeatherPreview } from "../services/weatherPreview";

import "../stylesheets/home/ww.home.css";

const DEFAULT_AMBIENT_LOCATION = {
    label: "Monterey, California",
    query: "Monterey, CA",
};

export default function Home() {
    const navigate = useNavigate();

    const [preview, setPreview] = useState(null);
    const [activeLocation, setActiveLocation] = useState(
        DEFAULT_AMBIENT_LOCATION
    );

    useEffect(() => {
        let cancelled = false;

        async function loadPreview(location) {
            try {
                const data = await fetchWeatherPreview(location.query);

                if (!cancelled) {
                    setPreview(data);
                    setActiveLocation(location);
                }
            } catch (error) {
                console.error("Failed to load homepage weather preview:", error);
            }
        }

        function loadFallback() {
            loadPreview(DEFAULT_AMBIENT_LOCATION);
        }

        if (!navigator.geolocation) {
            loadFallback();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordsQuery = `${position.coords.latitude},${position.coords.longitude}`;

                loadPreview({
                    label: "Current location",
                    query: coordsQuery,
                });
            },
            () => {
                loadFallback();
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 1000 * 60 * 10,
            }
        );

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <PageLayout wrapperStyle="ww_home">
            <AtmosphericHero
                preview={preview}
                onSearch={() =>
                    navigate(`/search?q=${encodeURIComponent(activeLocation.query)}`)
                }
            />

            <SectionLayoutLg wrapperStyle="ww_editorial_stage">
                <EditorialSection
                    eyebrow="Less noise. Better insights."
                    title="A calmer way to understand the forecast."
                    body="A forecast should help you understand more than temperature and percentages. Weather Whale interprets conditions in human terms so you can better understand how the day will actually feel outside."
                />
            </SectionLayoutLg>

            <SectionLayoutLg wrapperStyle="ww_editorial_stage">
                <FutureVisionSection />
            </SectionLayoutLg>
        </PageLayout>
    );
}