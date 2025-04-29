import React, { useState, useEffect } from 'react';

export default function HourlyTable({ currentConditions }) {

    return (
        <table className='hourly_table'>
            <tbody >
                <tr>
                    <th>Time</th>
                    <th>Conditions</th>
                    <th>Avg Temp</th>
                </tr>
                {
                    currentConditions.forecastday[0].hour.filter((_, index) => index % 4 === 0).map(hour => (
                        <tr>
                            <td>{hour.time.split(' ')[1]}</td>
                            <td>{hour.condition.text}</td>
                            <td>{`${hour.temp_f}°F`}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}

