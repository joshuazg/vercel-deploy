import Header from "../Header";
import "../../css/setgeo.css"
import Map from "../../component/map";

const SetGeo = ({ token }) => {
    const metadata = [
        { key: 'full_name', value: token.user.user_metadata.full_name },
        { key: 'email', value: token.user.email }
    ];

    return (
        <div className="geofence">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <Header token={metadata} />

                    </div>
                    <div className="caption">SET GEOFENCE AREA</div>
                    <div className="map">
                        <Map permission={true} width={800} height={800} zoom={16} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SetGeo