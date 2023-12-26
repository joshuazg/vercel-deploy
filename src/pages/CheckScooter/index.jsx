import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from '@react-google-maps/api';
import React, { Fragment, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'
import ScooterPin from '../../img/ScooterPin.png'
import ParkingPin from '../../img/ParkingPin.png'
import "../../css/checkscoot.css"
import Parking from './parking';

const Map = () => {

  //location 
  const [fetchError, setFetchError] = useState(null)
  const [scooterLocation, setScooterLocation] = useState(null)
  const [parkingLocation, setParkingLocation] = useState(null)

  useEffect(() => {
    async function getLocation() {
      try {
        const [scooterData, parkingData] = await Promise.all([
          supabase.from('scooter').select(),
          supabase.from('parking').select()
        ]);

        if (scooterData.error) {
          setFetchError('Could not fetch the scooter location');
          setScooterLocation(null);
          console.log(scooterData.error);
        }
        if (scooterData.data) {
          console.log(scooterData.data)
          setScooterLocation(scooterData.data);
          setFetchError(null);
        }

        if (parkingData.error) {
          setFetchError('Could not fetch the parking location');
          setParkingLocation(null);
          console.log(parkingData.error);
        }
        if (parkingData.data) {
          console.log(parkingData.data);
          setParkingLocation(parkingData.data);
          setFetchError(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getLocation();
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDLa-riXAI7E-RbBApDNWDP6O37PE9mkDA',
  });

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  }

  //show parking details 
  const [modal, setModal] = useState(false);
  const [selectedScooterId, setselectedScooterId] = useState(null);
  const [selectedAddressName, setSelectedAddressName] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
  }

  return (

    <Fragment>
      <div className='container'>


        <div style={{ width: "100%", height: "90vh" }} >

          {isLoaded ? (
            <GoogleMap
              center={{ lat: 3.212670, lng: 101.730576 }}
              zoom={15}
              onClick={() => setActiveMarker(null)}
              mapContainerStyle={{
                width: "100%",
                height: "90vh",
              }}
            >

              {scooterLocation?.map((location) => (
                <MarkerF
                  key={location.scooterId}
                  position={{
                    lat: parseFloat(location.latitude),
                    lng: parseFloat(location.longtitude)
                  }}
                  onClick={() => handleActiveMarker(location.scooterId)}
                  icon={{
                    url: ScooterPin,
                    scaledSize: { width: 150, height: 150 }
                  }}
                >
                  {activeMarker === location.scooterId && (
                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                      <div>
                        <div>{location.scooterId}</div>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}

              {parkingLocation?.map((location) => (
                <MarkerF
                  key={location.parkingId}
                  position={{
                    lat: parseFloat(location.latitude),
                    lng: parseFloat(location.longitude)
                  }}
                  onClick={() => handleActiveMarker(location.parkingId)}
                  icon={{
                    url: ParkingPin,
                    scaledSize: { width: 150, height: 150 }
                  }}
                >
                  {activeMarker === location.parkingId && (
                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                      <b>
                        <div>
                          <div>{location.parkingId}</div>
                          <div>{location.addressName}</div>
                          <div>{location.address}</div>
                          <button className='viewDetails' onClick={() => {
                            toggleModal();
                            setselectedScooterId(location.parkingId);
                            setSelectedAddressName(location.addressName);
                          }}>
                            View Details
                          </button>
                        </div>
                      </b>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}


            </GoogleMap>

          ) : null}

          {/* view parking details */}
          {modal && (
            <div className="modal" style={styles.modal}>
              <div onClick={toggleModal} className="overlay" style={styles.overlay}></div>
              <div className="modal-content" style={styles.modalContent}>
                <Parking
                  toggleModal={toggleModal}
                  scooterId={selectedScooterId}
                  location={selectedAddressName}
                />
                <br />
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Map;

const styles = {
  modal: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    zIndex: 999,
  },
  modalContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    lineHeight: 1.4,
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '3px',
    width: '900px',
    maxHeight: '70vh',
    overflow: 'auto',
    display: 'flex', // Center content vertically
    flexDirection: 'column', // Center content vertically
    alignItems: 'center', // Center content horizontally
    zIndex: 1000,
  },
  overlay: {
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    backgroundColor: 'rgba(49,49,49,0.8)',
  },
}