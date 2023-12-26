  import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient'
import Penalty from './penalty';
import ViewScooter from './viewScooter';
import { FaArrowLeft } from 'react-icons/fa';

import "../../css/user_index.css"

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  //fetch data -------------------------------------------------------
  const [fetchError, setFetchError] = useState(null);
  const [user, setUserInfo] = useState(null);
  const [scooter, setScooterInfo] = useState(null);
  const [rental, setRentalInfo] = useState(null);

  // console.log(token.user.email);

  
  useEffect(() => {
    async function getInfo() {
      try {
        const [userData, scooterData, rentalData] = await Promise.all([
          supabase.from('user').select('*').eq('schoolId', id),
          supabase.from('scooter').select('*'),
          supabase.from('rental').select('*').eq('schoolId', id)
        ]);

        if (userData.error) {
          setFetchError('Could not fetch the user data');
          setUserInfo(null);
          console.log(userData.error);
        } else if (userData.data) {
          setUserInfo(userData.data);
          setFetchError(null);
          console.log(userData.data);
        }

        if (scooterData.error) {
          setFetchError('Could not fetch the scooter data');
          setScooterInfo(null);
          console.log(scooterData.error);
        } else if (scooterData.data) {
          setScooterInfo(scooterData.data);
          setFetchError(null);
          console.log(scooterData.data);
        }

        if (rentalData.error) {
          setFetchError('Could not fetch the scooter rental data');
          setRentalInfo(null);
          console.log(rentalData.error);
        } else if (rentalData.data) {
          setRentalInfo(rentalData.data);
          setFetchError(null);
          console.log(rentalData.data);

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getInfo()
  }, [])

  //calculate data -----------------------------------------------------
  let rentalCount = 0;
  const totalRentals = rental ? rental.length : 0;

  const calculateTotalTime = () => {
    let totalTime = 0;
    if (rental) {
      rental.forEach(rentalData => {
        totalTime += rentalData.totalMinutes;
      });
    }
    return totalTime;
  };

  const calculateTotalDistance = () => {
    if (rental) {
      return rental.reduce((total, item) => total + item.distance, 0);
    }
    return 0;
  };

  //show impose penalty -----------------------------------------------------------
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  }

  //show scooter details 
  const [scooterModal, setScooterModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({
    scooterId: null,
    owner: null,
    date: null,
    totalMinutes: null,
    distance: null,
  });
  const toggleScooterModal = () => {
    setScooterModal(!scooterModal);
  }


  return (
    <div style={styles.page}>
      <div style={styles.backPosition}>
        <button style={styles.button} onClick={() => navigate('/user')}>
          <FaArrowLeft size={14} style={styles.icon} /> Back
        </button>
      </div>
      <h1 style={styles.bold} >USER DETAIILS</h1>

      {fetchError && (<p>{fetchError}</p>)}

      <div className='container' style={styles.container}>
        <div className="column" style={styles.column}>
          {user && (
            <div>
              {user.map(userData => (
                <div key={userData.schoolId}>
                  <p>
                    <span style={styles.bold}>User ID : </span>
                    <span>{userData.schoolId}</span>
                  </p>
                  <p>
                    <span style={styles.bold}>Username : </span>
                    <span>{userData.username}</span>
                  </p>
                  <p>
                    <span style={styles.bold}>School Email : </span>
                    <span>{userData.email}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='column' style={styles.column}>
          <p>
            <span style={styles.bold}>Total Number of Rental : </span>
            <span>{totalRentals}</span>
          </p>
          <p>
            <span style={styles.bold}>Total Time : </span>
            <span>{calculateTotalTime()} minutes</span>
          </p>
          <p>
            <span style={styles.bold}>Total Distance : </span>
            <span>{calculateTotalDistance()} meters</span>
          </p>
        </div>

        <div className="column" style={styles.column}>
          <p>
            <button style={styles.imposeButton} onClick={toggleModal}>Impose Penalty</button>
          </p>
        </div>
      </div>

      <div>
        <div className='user-container' style={styles.rentalContainer}>
          <table className='user-table' style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>No</th>
                <th style={thStyle}>Scooter ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Distance</th>
                <th style={thStyle}>Owner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rental && rental.length > 0 ? (
                rental.map((rentalData, index) => (
                  <tr key={rentalData.scooterId}>
                    <td style={tdStyle}>{++rentalCount}.</td>
                    <td style={tdStyle}>{rentalData.scooterId}</td>
                    <td style={tdStyle}>{rentalData.date}</td>
                    <td style={tdStyle}>{rentalData.totalMinutes} minutes</td>
                    <td style={tdStyle}>{rentalData.distance} meters</td>
                    <td style={tdStyle}>
                      {scooter.find(scooterData => scooterData.scooterId === rentalData.scooterId)?.owner || "No owner"}
                    </td>
                    <td>
                      {scooter.find(scooterData => scooterData.scooterId === rentalData.scooterId)?.owner && (
                        <button
                          onClick={() => {
                            toggleScooterModal();
                            setSelectedInfo({
                              scooterId: rentalData.scooterId,
                              owner: scooter.find(scooterData => scooterData.scooterId === rentalData.scooterId)?.owner || "No owner",
                              date: rentalData.date,
                              timeDifference: rentalData.totalMinutes,
                              distance: rentalData.distance,
                            });
                          }}
                          style={styles.viewbutton}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No scooter rent</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* penalty page */}
      {modal && (
        <div className="modal" style={styles.modal}>
          <div onClick={toggleModal} className="overlay" style={styles.overlay}></div>
          <div className="modal-content" style={styles.modalContent}>
            <Penalty toggleModal={toggleModal} id={id} name={user[0].username} email={user[0].email}/>
            <br />
          </div>
        </div>
      )}

      {/* View Scooter */}
      {scooterModal && (
        <div className="modal" style={styles.modal}>
          <div onClick={toggleScooterModal} className="overlay" style={styles.overlay}></div>
          <div className="modal-content" style={styles.modalContent}>
            <ViewScooter
              toggleModal={toggleScooterModal}
              info={selectedInfo}
              schoolId={id}
            />
            <br />
          </div>
        </div>
      )}

    </div>
  );
}

export default UserDetails;

const styles = {
  page: {
    marginTop: '20px',
    marginLeft: '20px',
    marginRight: '20px',
    backgroundColor: '#ffe2be',
    height: '95vh',
  },
  backPosition: {
    padding: '10px',
  },
  button: {
    display: 'flex',
    padding: '9px 15px',
    backgroundColor: '#ff8f00', // Green color, you can change it to your preferred color
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  icon: {
    marginRight: '5px',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: {
    marginLeft: '90px',
    marginRight: '10px',
    flex: '1',
    // color: '#ff8f00',
  },
  column: {
    flex: 1,
  },
  modal: {
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
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
    maxHeight: '70vh',
    overflow: 'auto',
    display: 'flex', // Center content vertically
    flexDirection: 'column', // Center content vertically
    alignItems: 'center', // Center content horizontally
    zIndex: '9999',
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
  rentalContainer: {
    marginTop: '20px',
  },
  rentalItem: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  viewbutton: {
    marginLeft: '15px',
    padding: '5px 10px',
    backgroundColor: '#ff8f00',
    color: '#ffffff',
    borderRadius: '3px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
  },
  imposeButton: {
    display: 'flex',
    padding: '9px 15px',
    backgroundColor: '#ff1500', // Green color, you can change it to your preferred color
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
}


const tableStyle = {
  width: '80%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  marginLeft: '90px',
  marginRight: '10px',
  border: '1px solid',
  overflow: 'hidden',
};

const thStyle = {
  padding: '8px',
  textAlign: 'left',
};

const tdStyle = {
  padding: '8px',
};

