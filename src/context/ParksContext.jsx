import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
const ParksContext = createContext(null);

const initialState = {
    parks: {},
    filteredParks: [],
    parkConditions: [], // forecast for active park
    activePark: null,
    detailedPark: null,
    compareParks: [],
    comparisonForecasts: {},
    tempRange: [50, 115],
    searchTerm: '',
    showModal: false,
    viewMode: 'map',
    primaryPark: null,
    loading: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_PARKS':
            return { ...state, parks: action.payload };

        case 'SET_FILTERED_PARKS':

            return { ...state, filteredParks: action.payload };

        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };

        case 'SET_TEMP_RANGE':
            return { ...state, tempRange: action.payload };



        case 'TOGGLE_MODAL':
            return { ...state, showModal: !state.showModal };

        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };

        case 'SET_COMPARE_PARKS':
            return { ...state, compareParks: action.payload };


        case 'SET_FORECAST':
            return {
                ...state,
                parkConditions: [
                    ...(state.parkConditions || []),
                    ...(action.payload.data || [])
                ],
                forecastTimestamp: action.payload.timestamp,
            };

        case 'SET_COMPARISON_FORECAST':
            return {
                ...state,
                comparisonForecasts: {
                    ...state.comparisonForecasts,
                    [action.payload.parkCode]: {
                        forecast: action.payload.data,
                    },
                },
            };
        case 'SET_COMPARISON_CONDITIONS':
            return {
                ...state,
                comparisonForecasts: {
                    ...state.comparisonForecasts,
                    [action.payload.parkCode]: {
                        current: action.payload.data,
                    },
                },
            };


        case 'SET_COMPARISON_HISTORY':
            return {
                ...state,
                comparisonForecasts: {
                    ...state.comparisonForecasts,
                    [action.payload.parkCode]: {
                        ...state.comparisonForecasts[action.payload.parkCode],
                        history: action.payload.data
                    },
                },
            };


        case 'SET_ACTIVE_PARK':
            if (!action.payload) return { ...state, activePark: null };
            return { ...state, activePark: action.payload };


        case 'ADD_COMPARE_PARK': {
            const code = action.payload.parkCode || action.payload;
            const alreadyAdded = state.compareParks.some(p => (p.parkCode || p) === code);
            if (alreadyAdded) return state;

            return {
                ...state,
                compareParks: [...state.compareParks, { parkCode: code }]
            };
        }

        case 'REMOVE_COMPARE_PARK':
            return {
                ...state,
                compareParks: state.compareParks.filter(p => (p.parkCode || p) !== action.payload)
            };
        case 'RESET_ALL_PARKS':
            return {
                ...state,
                activePark: null,
                compareParks: [],
                detailedPark: null,
                primaryPark: null,
                viewMode: 'map',
                showModal: false,
            };


        case 'SET_PRIMARY_PARK':
            return { ...state, primaryPark: action.payload };

        case 'SET_DETAILED_PARK':
            return { ...state, detailedPark: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        default:
            return state;
    }
}

export function ParksProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchCurrentConditions = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await fetch('/api/current-conditions-parks');
            const data = await res.json();
            const result = Object.values(data.data).reduce((acc, curr) => {
                acc[curr.parkCode] = curr;
                return acc;
            }, {});
            dispatch({ type: 'SET_PARKS', payload: result });
            dispatch({ type: 'SET_FILTERED_PARKS', payload: Object.values(result) });
        } catch (err) {
            console.error('[fetchCurrentConditions] Failed:', err);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);



    const fetchComparisonConditions = async (parkCode) => {
        const res = await fetch(`/api/current-conditions-parks`);
        const { data } = await res.json();
        const condition = Object.values(data).find(p => p.parkCode === parkCode);

        if (!condition) {
            console.warn(`[fetchComparisonConditions] No current data for ${parkCode}`);
            return;
        }

        dispatch({
            type: 'SET_COMPARISON_CONDITIONS',
            payload: {
                parkCode,
                data: condition
            }
        });
    };



    const fetchForecast = useCallback(async (parkCode, isComparison = false) => {
        const res = await fetch(`/api/park-conditions-detailed?parks=${parkCode}`);
        const json = await res.json();
        const { data, timestamp } = json || {};

        if (!Array.isArray(data)) {
            console.error('[fetchForecast] Invalid data:', data);
            return;
        }

        const flat = data.flatMap(entry =>
            Object.entries(entry?.hourly ?? {}).flatMap(([date, hours]) =>
                (hours ?? []).map(hour => ({
                    ...hour,
                    date,
                    park: entry.park,
                }))
            )
        );
        console.log(`[fetchForecast] ${isComparison ? 'Comparison' : 'Primary'} forecast for ${parkCode}:`, flat);

        dispatch({
            type: isComparison ? 'SET_COMPARISON_FORECAST' : 'SET_FORECAST',
            payload: isComparison
                ? { parkCode, data: flat }
                : { data: flat, timestamp },
        });
    }, []);


    const fetchHistoricalForecast = useCallback(async (parkCode, isComparison = false) => {
        const res = await fetch(`/api/park-conditions-history?parks=${parkCode}`);
        const { data } = await res.json();

        const flat = data.flatMap(entry =>
            Object.entries(entry.hourly).flatMap(([date, hours]) =>
                hours.map(hour => ({
                    ...hour,
                    date,
                    park: entry.park
                }))
            )
        );

        if (isComparison) {
            dispatch({
                type: 'SET_COMPARISON_HISTORY',
                payload: { parkCode, data: flat }
            });
        } else {
            dispatch({
                type: 'SET_FORECAST',
                payload: { data: flat, timestamp: null }
            });
        }

        return data;
    }, []);

    // Search + Temp filtering
    useEffect(() => {
        const parksArray = Object.values(state.parks || {});
        const query = state.searchTerm.toLowerCase();

        const filtered = parksArray.filter((item) => {
            const matchesSearch =
                item.name?.toLowerCase().includes(query) ||
                item.fullName?.toLowerCase().includes(query) ||
                item.state?.toLowerCase().includes(query);
            const withinTemp =
                item.temp_f >= state.tempRange[0] &&
                item.temp_f <= state.tempRange[1];
            return matchesSearch && withinTemp;
        });

        dispatch({ type: 'UPDATE_FILTERED_PARKS', payload: filtered });
    }, [state.parks, state.searchTerm, state.tempRange]);

    // Dynamically adjust temp range
    useEffect(() => {
        const temps = Object.values(state.parks || {}).map(p => p.temp_f);
        if (temps.length) {
            const min = Math.min(...temps);
            const max = Math.max(...temps);
            dispatch({ type: 'SET_TEMP_RANGE', payload: [min, max] });
        }
    }, [state.parks]);

    // Fetch forecast when active park changes
    /* useEffect(() => {
        if (!state.activePark) return;
        const code = typeof state.activePark === 'object'
            ? state.activePark.parkCode
            : state.activePark;
        fetchForecast(code);
    }, [state.activePark, fetchForecast]);*/

    // Compare view: preload history and reuse forecast if needed
    useEffect(() => {
        if (!state.compareParks?.length) return;
        state.compareParks.forEach((park) => {
            const code = park.parkCode;

            if (state.activePark?.parkCode === code && state.parkConditions?.length) {
                dispatch({
                    type: 'SET_COMPARISON_FORECAST',
                    payload: {
                        parkCode: code,
                        data: state.parkConditions,
                        meta: state.parkMeta || {}
                    }
                });
            }

            fetchHistoricalForecast(code, true);
        });
    }, [state.compareParks]);

    return (
        <ParksContext.Provider value={{
            state,
            dispatch,
            fetchCurrentConditions,
            fetchForecast,
            fetchHistoricalForecast
        }}>
            {children}
        </ParksContext.Provider>
    );
}

export function useParks() {
    return useContext(ParksContext);
}
