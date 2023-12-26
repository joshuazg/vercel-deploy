import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

//Header
import Header from "../Header";
import Map from "../../component/map";
import EmbeddedMap from "./EmbeddedMap";

//CSS
import "../../css/dashboard.css"

//Image & Icon
import Scooter from "../../img/scooter.png"
import { AiOutlineUser } from "react-icons/ai";
import { TiMessages } from "react-icons/ti";

const Dashboard = ({ token }) => {
    const metadata = [
        { key: "full_name", value: token.user.user_metadata.full_name },
        { key: "email", value: token.user.email },
    ];

    const [userCount, setUserCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [rentalCount, setRentalCount] = useState(0);
    const [rentals, setRentals] = useState([]);

    const navigate = useNavigate()

    const countRentalsByMonth = () => {
        const monthlyRentalsCount = {};

        rentals.forEach((rental) => {
            const month = rental.date.substring(0, 7); // Extract YYYY-MM
            if (!monthlyRentalsCount[month]) {
                monthlyRentalsCount[month] = 0;
            }
            monthlyRentalsCount[month]++;
        });

        return monthlyRentalsCount;
    };

    const monthlyRentalsCount = countRentalsByMonth();


    useEffect(() => {
        async function getUser() {
            try {
                const { data: user, error } = await supabase
                    .from('user')
                    .select('count')

                if (error) {
                    console.error('Error fetching user count:', error.message);
                } else {
                    setUserCount(user[0].count);
                }
            } catch (error) {
                console.error('Error getting user count:', error.message);
            }
        }
        async function getComment() {
            try {
                const { data: comment, error } = await supabase
                    .from('comment')
                    .select('count')

                if (error) {
                    console.error('Error fetching user count:', error.message);
                } else {
                    setCommentCount(comment[0].count);
                }
            } catch (error) {
                console.error('Error getting user count:', error.message);
            }
        }

        async function getRental() {
            try {
                const { data: rental, error } = await supabase
                    .from('rental')
                    .select('count')

                if (error) {
                    console.error('Error fetching rental count:', error.message);
                } else {
                    setRentalCount(rental[0].count);
                }
            } catch (error) {
                console.error('Error getting rental count:', error.message);
            }
        }

        const fetchRentals = async () => {
            try {
                const { data, error } = await supabase
                    .from('rental')
                    .select('date');

                if (error) {
                    console.error('Error fetching rentals:', error.message);
                } else {
                    setRentals(data);
                }
            } catch (error) {
                console.error('Error fetching rentals:', error.message);
            }
        };



        fetchRentals();
        getUser()
        getComment()
        getRental()
    }, [])

    return (
        <div className="dashboard">
            <Header token={metadata} />

            <div className="maps">
                <Map permission={false} width={635} height={480} zoom={15} />

            </div>
            <div className="welcome" style={{ cursor: 'pointer' }} onClick={() => navigate(`/user`)}>
                <div className="overlap-4" >
                    <div className="text-wrapper-19">Users</div>
                    <AiOutlineUser className="user" />
                    <div className="text-wrapper-20">{userCount}</div>
                </div>
            </div>
            <div className="comments-all" style={{ cursor: 'pointer' }} onClick={() => navigate(`/comment`)}>
                <div className="overlap-3">
                    <div className="overlap-group-2">
                        <div className="text-wrapper-17">Comments</div>
                        <div className="text-wrapper-18">{commentCount}</div>
                    </div>
                    <TiMessages className="chat-conversation" />
                </div>
            </div>
            <div className="monthly-rental">
                <div className="overlap-2">
                    <div className="monthly">Monthly of renting scooter</div>
                    {Object.entries(monthlyRentalsCount).map(([month, count]) => (
                        <div key={month} className="rental-wrapper">
                            <div className="rental-month">
                                {month}
                            </div>
                            <span className="rental-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rented">
                <div className="overlap-group">
                    <div className="text-wrapper">{rentalCount}</div>
                    <div className="div">Rented Amount</div>
                    <img className="scooter" src={Scooter} alt="Scooter" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;