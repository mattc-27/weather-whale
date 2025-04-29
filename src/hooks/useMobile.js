// hook for tracking width and mobile?

import React, { useState, useEffect } from 'react';

export function useMobile(threshold = 780) {

    const [isMobile, setIsMobile] = useState(window.innerWidth < threshold);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < threshold);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [threshold]);

    return isMobile;
}


export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            setBreakpoint(getBreakpoint(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint; // returns a string like 'small', 'medium', 'large'
}

function getBreakpoint(width) {
    if (width < 540) {
        return 'xsmall';    // phones
    } else if (width < 780) {
        return 'small';     // small tablets
    } else if (width < 1024) {
        return 'medium';    // tablets, small laptops
    } else {
        return 'large';     // desktops
    }
}
