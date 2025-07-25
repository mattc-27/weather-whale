import React, { useState, useEffect } from 'react'
const selectedFile = 'current/latest'

const fetchParkList = async () => {
    try {
        const res = await fetch(selectedFile); // adjust if needed
        const data = await res.json();

        return data
    } catch (err) {
        console.error('Failed to load park list:', err);
    }
};


export {

    fetchParkList
}