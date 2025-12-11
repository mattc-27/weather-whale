// src/utils/loadGoogleMaps.js
let loadingPromise = null;

export function ensureGoogleMaps() {
    if (typeof window === 'undefined') return Promise.resolve(); // SSR guard

    // Already loaded?
    if (window.google?.maps?.places) return Promise.resolve();

    // Already loading?
    if (loadingPromise) return loadingPromise;

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
        return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is missing.'));
    }

    const url = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly`;

    loadingPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(s);
    });

    return loadingPromise;
}
