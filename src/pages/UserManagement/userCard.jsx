import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


export function UserCard(props) {
  const navigate = useNavigate();

  return (
    <div
      className="userList"
      style={styles.userList}
      onClick={() => navigate(`/userDetails/${props.schoolId}`)}
    >
      <div className="userCard">
        <div className="userCard_content" style={styles.userCard_content}>
          <div>
            <span><AiOutlineUser style={styles.userIcon} /> </span>
            <span style={styles.userContent}>User ID : </span>
            <span>{props.schoolId}</span>
          </div>
          <div>
            <span style={styles.userContent}>Username : </span>
            <span>{props.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  userList: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "5rem",
    cursor: 'pointer',
  },
  userIcon: {
    top: 0,
    left: 0,
    width: "80px",
    height: "80px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  },
  userCard_content: {
    padding: '20px'
  },
  userContent: {
    fontWeight: 'bold',
  },
}