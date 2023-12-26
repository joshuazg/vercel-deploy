import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import '../css/header.css'
import { SearchBar, SearchResultsList } from "./Dashboard/SearchBar";

//Image
import logoImage from '../img/logo-no-background-1.png';
import lineImage from '../img/line-17.svg';
import dashboardIcon from '../img/dashboardicons.png';
import scooterImage from '../img/mdi-scooter.svg';
import materialsLight from '../img/materials-light.png';
import dateRangeDuotone from '../img/date-range-duotone.png';
import subtractImage from '../img/subtract.svg';
import geofencingImage from '../img/fluent-data-area-24-filled.svg';
import signOutImage from "../img/signout-1.svg"

//React icons
// import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import emailjs from '@emailjs/browser';
import { LiaEdit } from "react-icons/lia";

const CDNURL = "https://hhdihrpmwxaycjjsjusf.supabase.co/storage/v1/object/public/test/";

const NotifiedForm = ({ onSubmit, onCancel }) => {
    const [selectedUser, setSelectedUser] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({ sendToEveryone: selectedUser, message });
    };

    return (
        <form onSubmit={handleSubmit} className="notified-form-container">
            <label>
                Send to:
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="everyone">Everyone</option>
                </select>
            </label>

            <label>
                Message:
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                />
            </label>

            <button className="submit-notif" type="submit">Submit</button>
            <button className="cancel-notif" type="cancel" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const Header = ({ token }) => {

    const [images, setImages] = useState([]);
    const [results, setResults] = useState([]);
    const userEmailInfo = token.find(item => item.key === 'email');
    const userEmail = userEmailInfo ? userEmailInfo.value : null;
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showSendNotified, setShowSendNotified] = useState(false);
    const [users, setUsers] = useState([]);
    const [showSendNotifSuccess, setShowSendNotifSuccess] = useState(false);


    let navigate = useNavigate()


    function handleLogout() {
        sessionStorage.removeItem('token')
        navigate('/')
    }

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handledNotified = () => {
        setShowSendNotified(true);
    }

    const handledCancelNotified = () => {
        setShowSendNotified(false);
    }

    const handleFormSubmit = async ({ sendToEveryone, message }) => {
        try {


            // Close the form after submission
            setShowSendNotified(false);

            let toEmailArray;
            toEmailArray = users.map(user => user.email);

            const templateParams = {
                to_email: toEmailArray.join(","),
                message: message,
            };
            if (message != null) {
                await sendEmail(templateParams);
                setTimeout(() => {
                    setShowSendNotifSuccess(true)
                    console.log("Sent successful");

                    setTimeout(() => {
                        setShowSendNotifSuccess(false)
                    }, 5000)
                }, 1000);
            }
        } catch (error) {
            console.error("Error sending email and notification:", error);
        }
    };

    const sendEmail = async (templateParams) => {
        try {
            const result = await emailjs.send('service_nrt95gk', 'template_wj595gg', templateParams, 'RP6muO3PswGkd79LK');
            console.log(result.text);
        } catch (error) {
            console.error(error.text);
        }
    };

    useEffect(() => {
        const getImages = async () => {
            const { data, error } = await supabase.storage
                .from('test')
                .list(userEmail + "/", {
                    limit: 10,
                    offset: 0,
                    sortBy: {
                        column: 'name',
                        order: 'asc'
                    }
                })

            if (data) {
                setImages(data);
            } else {
                console.log(error);
            }
        }

        const fetchReportData = async () => {
            try {
                const { data, error } = await supabase
                    .from('report')
                    .select('id, user, user:user(username), scooter, title, created_at')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching report data:', error);
                } else {
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from('user')
                    .select('email');

                if (data) {
                    setUsers(data);
                } else {
                    console.error('Error fetching users:', error);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };


        fetchUsers();
        getImages();
        fetchReportData();
    }, [])

    return (
        <div className="header">
            <div className="head">
                <div className="head-wrapper">
                    <div className="side-bar">
                        <div to="/dashboard">
                            <img className="logo-no-background" src={logoImage} alt="GoScoot Logo" />
                            <div className="logo-wrapper-1">GoScoot</div>
                        </div>
                        <div className="line" src={lineImage} alt="Line" />

                        <div className="dashboard-all">
                            <div className="side-bar-overlap">
                                <img className="img" src={dashboardIcon} alt="DashboardIcon" />
                                <Link className="side-bar-wrapper-1" to="/dashboard">Dashboard</Link>
                            </div>
                        </div>
                        <div className="check-scooter-all">
                            <div className="side-bar-overlap">
                                <img className="mdi-scooter" src={scooterImage} alt="ScooterIcon" />
                                <Link className="side-bar-wrapper-2" to="/checkscoot">Check Scooter</Link>
                            </div>
                        </div>
                        <div className="inventory-all">
                            <div className="side-bar-overlap">
                                <img className="materials-light" src={materialsLight} alt="InventoryIcon" />
                                <Link className="side-bar-wrapper-2" to="/inventory">Inventory</Link>
                            </div>
                        </div>
                        <div className="schedule-all">
                            <div className="side-bar-overlap">
                                <img className="date-range-duotone" src={dateRangeDuotone} alt="ScheduleIcon" />
                                <Link className="side-bar-wrapper-2" to="/schedule">Schedule</Link>
                            </div>
                        </div>
                        <div className="user-management">
                            <div className="side-bar-overlap">
                                <img className="date-range-duotone" src={subtractImage} alt="UserIcon" />
                                <Link className="side-bar-wrapper-2" to="/user">User Management</Link>
                            </div>
                        </div>
                        <div className="set-geofencing">
                            <div className="side-bar-overlap">
                                <img className="img" src={geofencingImage} alt="GeofenIcon" />
                                <Link className="side-bar-wrapper-2" to="/setgeo">Set Geofencing</Link>
                            </div>
                        </div>

                    </div>

                    <div className="top-bar">
                        <div className="input-wrapper">
                            <SearchBar setResults={setResults} />
                            {results && results.length > 0 && <SearchResultsList results={results} />}
                        </div>
                        <div className="top-bar-container">
                            {/* <div className="question-container">
                                <AiOutlineQuestionCircle className="question" href="" />

                            </div> */}

                            <div className="notification-container">
                                <IoNotificationsOutline className="bell" onClick={handleBellClick} />
                                {showNotifications && (
                                    <div className="notification-box">
                                        <div style={style.headBox}>
                                            <span>Notifications</span>
                                            <span><LiaEdit onClick={handledNotified} className="sent-notify" /></span>
                                            {/* <span><IoIosSettings className="gearNot" style={style.gearIcon} /></span> */}
                                        </div>
                                        {notifications.map((notifications) => (
                                            <p key={notifications.id} style={style.notification}>
                                                <span style={style.username}>User: {notifications.user.username}</span>
                                                <span style={style.scooter}>Scooter: {notifications.scooter}</span>
                                                <div style={style.problem}>Problem: {notifications.title}</div>
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {showSendNotified && (
                                <div className="overlay">
                                    <div className="notified-form">
                                        <NotifiedForm onSubmit={handleFormSubmit} onCancel={handledCancelNotified} />
                                    </div>
                                </div>
                            )}
                            <div className="user-2">
                                <div className="pic-container">
                                    {images.map((image) => (
                                        <div key={image.name}>
                                            <img className="profile-picture"
                                                src={CDNURL + userEmail + "/" + image.name}
                                                alt={image.name}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="profile">
                                    {token.map(({ key, value }, index) => (
                                        <div key={index}>
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <span className="signout"><img src={signOutImage} alt="SignOut" /></span>
                            <div className="dropdown-content">
                                <button className="logout" onClick={handleLogout}>Log Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSendNotifSuccess && (
                <div className="success-message">
                    <p>Sent successful!</p>
                </div>
            )}
        </div>
    );
};

export default Header;

const style = {
    notification: {
        marginBottom: '10px',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#f7f7f7',
    },
    headBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    username: {
        fontWeight: 'bold',
        marginRight: '10px',
    },
    scooter: {
        fontStyle: 'italic',
        marginRight: '10px',
    },
    problem: {
        color: '#e74c3c', // or any other color you prefer
    },
    gearIcon: {
        width: '24px',
        height: '24px',
        cursor: 'pointer',
    },
};