// src/components/parks/park-components/ParkToolsInline.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParkSearchInput from "./ParkSearchInput";
import TempRangeFilter from "./TempRangeFilter";
import { useParks } from "../../../context/ParksContext";
import { openParkDetails } from "../../../util/handlers";

/**
 * Inline version of the sidebar tools for mobile.
 * Renders the same UI as AnalyticsSidebar, based on the current view path.
 *
 * Props:
 *  - viewPath: string (e.g., '/parks', '/parks/details', '/parks/compare')
 */
export default function ParkToolsInline({ viewPath }) {
    const [searchInput, setSearchInput] = useState("");
    const { state, dispatch, fetchCurrentConditions } = useParks();
    const {
        filteredParks,
        tempRange,
        minTemp,
        maxTemp,
        compareParks,
    } = state;

    const navigate = useNavigate();

    const handleAddCompare = async (park) => {
        const code = park.parkCode;
        const alreadyAdded = compareParks.some((p) => p.parkCode === code);
        if (alreadyAdded || compareParks.length >= 2) return;

        await fetchCurrentConditions();
        dispatch({ type: "ADD_COMPARE_PARK", payload: park });
        setSearchInput("");
    };

    const renderCompare = () => {
        if (compareParks.length < 2) {
            return (
                <ParkSearchInput
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSelect={handleAddCompare}
                    placeholder="Add park to compare..."
                    exclude={compareParks.map((p) => p.parkCode)}
                />
            );
        }
        return (
            <>
                <p className="sidebar-note">Max parks added. Remove one or reset.</p>
                <button
                    className="reset-comparison"
                    onClick={() => dispatch({ type: "RESET_ALL_PARKS" })}
                >
                    Reset Comparison
                </button>
            </>
        );
    };

    const renderDetails = () => (
        <ParkSearchInput
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSelect={(park) => {
                dispatch({ type: "SET_DETAILED_PARK", payload: park });
                openParkDetails(dispatch, park, navigate);
                setSearchInput("");
            }}
            placeholder="Search for park..."
            exclude={compareParks.map((p) => p.parkCode)}
        />
    );

    const renderMap = () => (
        <TempRangeFilter
            range={tempRange}
            min={minTemp}
            max={maxTemp}
            onChange={(newRange) =>
                dispatch({ type: "SET_TEMP_RANGE", payload: newRange })
            }
        />
    );

    const body =
        viewPath === "/parks/compare"
            ? renderCompare()
            : viewPath === "/parks/details"
                ? renderDetails()
                : renderMap();

    return (
        <section className="inline-tools">
            <div className="inline-tools_header">
                {viewPath === "/parks/compare" && <h3>Add another park</h3>}
                {viewPath === "/parks/details" && <h3>Find a park</h3>}
                {viewPath === "/parks" && <h3>Filter by temperature</h3>}
                <span className="inline-count">{filteredParks.length} park(s) shown</span>
            </div>
            <div className="inline-tools_body">{body}</div>
        </section>
    );
}
