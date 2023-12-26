import React from 'react';
import "../../css/checkscoot.css"
import Map from "./index"
import Header from '../Header';

//Image

const CheckScoot = ({ token }) => {
    const metadata = [
        { key: "full_name", value: token.user.user_metadata.full_name },
        { key: "email", value: token.user.email },
    ];

    return (
        <div className="check-scoot">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <Header token={metadata} />

                    </div>
                    <div className="caption">CHECK SCOOTER</div>
                    <div className="map">
                        <Map />
                    </div>

                </div>
            </div>
        </div>
    );
}
export default CheckScoot