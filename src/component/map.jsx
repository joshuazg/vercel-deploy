import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import "../css/map.css"

function Geofence({ permission, width, height, zoom }) {

    const [showSaveMessage, setSaveMessage] = useState(false);
    const [showResetMessage, setResetMessage] = useState(false);


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDLa-riXAI7E-RbBApDNWDP6O37PE9mkDA'
    });

    const containerStyle = {
        width: width,
        height: height
    };

    const center = {
        lat: 3.215816, lng: 101.728710
    };

    const polygonRef = useRef(null);
    const [polygonPaths, setPolygonPaths] = useState(() => {
        // Load from localStorage or use the originalPaths if not available
        const savedPaths = JSON.parse(localStorage.getItem('polygonPaths'));
        return savedPaths || [
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
    });

    const originalPaths = [
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

    const onLoad = polygon => {
        polygonRef.current = polygon;
    };

    useEffect(() => {
        // Update the polygon paths whenever polygonPaths change
        if (polygonRef.current) {
            polygonRef.current.setPaths(polygonPaths);
        }
    }, [polygonPaths]);

    const updateCoordinates = async () => {
        if (polygonRef.current) {
            const updatedCoordinates = polygonRef.current.getPath().getArray();
            console.log('Updated Coordinates:', updatedCoordinates);
            // Update local storage
            localStorage.setItem('polygonPaths', JSON.stringify(updatedCoordinates));

            setTimeout(() => {
                setSaveMessage(true);
                console.log("Save coordinates successful");

                setTimeout(() => {
                    setSaveMessage(false);
                }, 5000)
            }, 1000);
        }
    };

    const resetPolygon = () => {
        if (polygonRef.current) {
            polygonRef.current.setPaths(originalPaths);
            setTimeout(() => {
                setResetMessage(true);
                console.log("Reset coordinates successful");

                setTimeout(() => {
                    setResetMessage(false);
                }, 5000)
            }, 1000);

        }
    };

    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
            >
                <Polygon
                    paths={polygonPaths}
                    onLoad={onLoad}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        fillColor: '#FF111',
                        fillOpacity: 0.35,
                        editable: permission,
                    }}
                />
            </GoogleMap>
            {permission && (
                <div className="button-container">
                    <button onClick={updateCoordinates}>Save</button>
                    <button className="reset" onClick={resetPolygon}>Reset</button>
                </div>
            )}

            {showSaveMessage && (
                <div className="success-message">
                    <p>Coordinate change successful!</p>
                </div>
            )}

            {showResetMessage && (
                <div className="success-message">
                    <p>Reset Coordinate successful!</p>
                </div>
            )}

        </div>
    ) : <></>;
}

export default React.memo(Geofence);