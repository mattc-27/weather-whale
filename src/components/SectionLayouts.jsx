import React from 'react';

export function PageLayout({ children, wrapperStyle, style }) {
    return (
        <div className={wrapperStyle} style={style}>
            {children}
        </div>
    );

}

export function SectionLayoutMain({ children, wrapperStyle }) {
    return (
        <section className={wrapperStyle}>
            {children}
        </section>
    );

}

export function SectionLayoutLg({ children, style, wrapperStyle }) {
    return (
        <section className={wrapperStyle} style={style}>

            {children}
        </section>
    );

}
export function ConditionsSection({ children, wrapperStyle, background }) {
    return (
        <section className={wrapperStyle} style={{ minHeight: '25vh' }}>

            {children}
        </section>
    );

}

export function ConditionsContent({ text, wrapperStyle }) {
    return (
        <div className={wrapperStyle}>
            <p>{text}</p>

        </div>

    );

}

export function IconContainer({ icon, wrapperStyle }) {
    return (
        <div className={wrapperStyle} style={{ maxWidth: '25%' }}>
            {icon}

        </div>

    );

}

export function TextBlock({ children, wrapperStyle, style }) {
    return (
        <div className={wrapperStyle} style={style}>
            {children}

        </div>

    );

}

