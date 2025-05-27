import { useState, useEffect, useRef } from 'react';
import '../../stylesheets/dogcomfort.css';

export default function DogComfortPupup({ handleClose }) {

    return (
        <div className="dog-weather-popover">
            <div className='row items_center content_between' style={{ width: '100%', maxWidth: '98%' }}>
                <h3 className="popover-heading">🐶 Dog Weather Details</h3>
                <button className='close_button' onClick={handleClose}>Close</button>
            </div>
            <section className="popover-section">
                <h4 className="section-title">🌡️ Temperature Comparison</h4>
                <ul className="section-list">
                    <li><strong>50–60°F (You)</strong> ≈ 60–70°F (Dog)</li>
                    <li><strong>65–75°F</strong> ≈ 75–80°F — comfy but hydrate</li>
                    <li><strong>80°F+</strong> ≈ 90°F+ — overheat risk</li>
                </ul>
            </section>
            <section className="popover-section">
                <h4 className="section-title">🌦️ Weather Factors</h4>
                <ul className="section-list">
                    <li>☁️ Cloudy = safer, cooler paws</li>
                    <li>☀️ Sunny = adds 5–10°F felt</li>
                    <li>🌬️ Windy = fun but dries throat</li>
                    <li>🧊 Snow = exciting but salt burns</li>
                </ul>
            </section>
            <section className="popover-section">
                <h4 className="section-title">🐾 Comfort Levels</h4>
                <table className="comfort-table">
                    <thead>
                        <tr>
                            <th>Feels Like</th>
                            <th>Comfort</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>50–60°F</td><td>Crisp & Energizing</td></tr>
                        <tr><td>60–70°F</td><td>Ideal</td></tr>
                        <tr><td>70–80°F</td><td>Warm but Manageable</td></tr>
                        <tr><td>80–90°F</td><td>Starting to Overheat</td></tr>
                        <tr><td>90–100°F</td><td>Too Hot</td></tr>
                        <tr><td>100°F+</td><td>Emergency</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
