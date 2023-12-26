import React, { useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';

const containerStyle = {
    width: '635px',
    height: '480px'
};

const center = {
    lat: 3.215816, lng: 101.728710
};

const polygonPaths = [
    { lat: 3.216923, lng: 101.724791 },
    { lat: 3.213814, lng: 101.725897 },
    { lat: 3.211402, lng: 101.726428 },
    { lat: 3.209338, lng: 101.727718 },
    { lat: 3.209347, lng: 101.728057 },
    { lat: 3.211310, lng: 101.729567 },
    { lat: 3.212653, lng: 101.730363 },
    { lat: 3.212982, lng: 101.730876 },
    { lat: 3.214709, lng: 101.732258 },
    { lat: 3.215669, lng: 101.734381 },
    { lat: 3.215907, lng: 101.735955 },
    { lat: 3.216700, lng: 101.736396 },
    { lat: 3.218689, lng: 101.735836 },
    { lat: 3.218564, lng: 101.727243 },
    { lat: 3.218218, lng: 101.726281 },
];

function EmbeddedMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDLa-riXAI7E-RbBApDNWDP6O37PE9mkDA'
    });

    const polygonRef = useRef(null);

    const onLoad = polygon => {
        polygonRef.current = polygon;
    };

    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
            >
                <Polygon
                    paths={polygonPaths}
                    onLoad={onLoad}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        fillColor: '#FF111',
                        fillOpacity: 0.35,
                    }}
                />
            </GoogleMap>
        </div>
    ) : <></>;
}

export default React.memo(EmbeddedMap);
