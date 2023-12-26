import Header from "../Header"
import React from "react"
import Time from "./Times"
import "../../css/schedule.css"

const Schedule = ({ token }) => {

  const metadata = [
    { key: 'full_name', value: token.user.user_metadata.full_name },
    { key: 'email', value: token.user.email }
  ];



  return (
    <div className="schedule">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <Header token={metadata} />

          </div>
          <div className="caption">MAINTENANCE SCHEDULE</div>
          <div className="timetable">
            <Time/>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Schedule