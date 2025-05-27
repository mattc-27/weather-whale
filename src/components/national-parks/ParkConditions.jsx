import React, { useEffect, useState } from 'react';
import ParkMap from './ParkMap';

function ParkConditions() {
    const [parks, setParks] = useState([]);

    useEffect(() => {
        fetch('../../../public/national_parks_with_temps.json') // or `/api/parks` if served via Express
            .then(res => res.json())
            .then(setParks);
    }, []);

    useEffect(() => {
        console.log(parks)
    }, [parks])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', border: '0.5px solid red', minHeight: '100vh' }}>
            <div style={{ flexGrow: '0.5' }}>
                <h1>US National Parks Temperatures</h1>
            </div>
            <div style={{ flexGrow: '1' }}>
                <ParkMap parks={parks} />
            </div>
        </div>
    );
}

export default ParkConditions;
