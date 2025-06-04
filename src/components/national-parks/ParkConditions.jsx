import React, { useEffect, useState } from 'react';
import ParkMap from './ParkMap';
import { TitleContainer } from '../Containers';

function ParkConditions() {
    const [parks, setParks] = useState([]);
    const [lastUpdated, setLastUpdated] = useState('');
    const [historyFiles, setHistoryFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('weather/latest.json');

    useEffect(() => {
        fetchHistoryList();
    }, []);

    useEffect(() => {
        if (selectedFile) {
            fetchParkData(selectedFile);
        }
    }, [selectedFile]);



    async function fetchHistoryList() {
        try {
            const res = await fetch('/api/list-park-history');
            const data = await res.json();

            // Sort newest first based on `updated`
            const sorted = data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            setHistoryFiles(sorted);

            // Auto-select latest.json if present
            const latest = sorted.find(f => f.name === 'latest' || f.fullPath.includes('latest.json'));
            if (latest) {
                setSelectedFile(latest.fullPath);
            }
        } catch (error) {
            console.error('Failed to fetch park history:', error);
        }
    }

    async function fetchParkData(path) {
        try {
            const res = await fetch(`/api/park-weather?path=${encodeURIComponent(path)}`);
            const data = await res.json();
            console.log('Fetched parks:', data);
            setParks(data.data);
            setLastUpdated(data.lastUpdated);
        } catch (err) {
            console.error('Failed to fetch park data:', err);
        }
    }

    useEffect(() => {
        console.log(selectedFile)
    }, [selectedFile])

    return (

        <div className="park-page">
            <section className="title-section">
                <h1 className="title">US National Parks Temperatures</h1>
                {lastUpdated && (
                    <p className="updated">Updated {lastUpdated}</p>
                )}
                {historyFiles.length > 0 && (
                    <select
                        className="history-dropdown"
                        value={selectedFile}
                        onChange={e => setSelectedFile(e.target.value)}
                    >
                        {historyFiles.map(file => (
                            <option key={file.fullPath} value={file.fullPath}>
                                {file.name === 'latest' ? 'Latest' : file.name}
                            </option>
                        ))}
                    </select>
                )}
            </section>

            <section className="map-section" aria-label="National Park Temperatures Map">
                {parks && <ParkMap parks={parks} />}
            </section>
        </div>


    );
}

export default ParkConditions;
