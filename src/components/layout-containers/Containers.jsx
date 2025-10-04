import React from "react";


function Container({ wrapperStyle, children }) {

    return (

        <div className={wrapperStyle} >

            {children}

        </div>
    )
}

function TitleContainer({ wrapperStyle, title, style }) {

    return (

        <div className={wrapperStyle} style={style} >

            <h1>{title}</h1>

        </div>
    )
}

function TitleContainerLocation({ wrapperStyle, searchLocation }) {

    return (

        <div className={wrapperStyle} >

            <h2>{searchLocation.name}, {searchLocation.region}</h2>

        </div>
    )
}

function SearchButtonInitial({ handleButtonClick, text, styleClass, style }) {

    return (
        <div className={styleClass} style={style}>
            <button

                onClick={() => handleButtonClick()}
                style={{ cursor: 'pointer' }}
            >{text}
            </button>
        </div>
    )
}

function BackgroundOverlay({ background }) {

    <div className="bg_overlay"
        style={{
            backgroundImage: `${background}`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',

        }}>

    </div>

}


function ConditionsSection({ children, wrapperStyle }) {
    return (
        <div className={wrapperStyle}>
            {children}
        </div>
    )
}

function MainGrid({ children, wrapperStyle }) {
    return (
        <div className={wrapperStyle}>
            {children}
        </div>
    )
}


export { MainGrid, ConditionsSection, Container, TitleContainer, SearchButtonInitial, TitleContainerLocation, BackgroundOverlay };