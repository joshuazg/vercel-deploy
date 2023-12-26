import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient'
import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import emailjs from '@emailjs/browser';

import styled from 'styled-components';
import "../../css/user_index.css"




const sendEmail = async (templateParams) => {
  try {
    const result = await emailjs.send('service_nrt95gk', 'template_1c2aqah', templateParams, 'RP6muO3PswGkd79LK');
    console.log(result.text);
  } catch (error) {
    console.error(error.text);
  }
};


export default function Penalty({ toggleModal, id, name, email }) {
  const form = useRef();

  const [showCompensateMessage, setCompensateMessage] = useState(false)
  const [showPermissionMessage, setPermissionMessage] = useState(false)
  const [compensate, setCompensate] = useState(null);
  const [compensateError, setCompensateError] = useState(null);
  const [value, setValue] = useState(null);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [reason, setReason] = useState(null);

  const getPenaltyCount = async () => {
    const { data, error } = await supabase
      .from('penalty')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error fetching penalty count: ', error);
    } else {
      console.log("count: " + data.length)
      return data.length;
    }
  }

  const items = [
    { value: 'a', label: 'Compensate' },
    { value: 'b', label: 'Grant Permission' },
  ];


  const calculateTimeDifference = () => {
    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);
    const diff = end.diff(start, 'minute');

    const days = Math.floor(diff / (60 * 24));
    const hours = Math.floor((diff % (60 * 24)) / 60);
    const minutes = diff % 60;

    if (days === 0 && hours === 0 && minutes === 0) {
      return null;
    } else if (diff < 0) {
      return 'Error';
    } else if (days === 0 && hours === 0) {
      return `${minutes} minutes`;
    } else if (days === 0) {
      return `${hours} hours, ${minutes} minutes`;
    } else {
      return `${days} days, ${hours} hours, ${minutes} minutes`;
    }
  };


  function getCompensate(val) {
    const pattern = /^\d+(\.\d{1,2})?$/;
    if (pattern.test(val.target.value) || val.target.value === '') {
      setCompensate(val.target.value);
      setCompensateError(null);
      console.log(val.target.value);
    } else {
      setCompensateError("Please enter a valid money format (e.g., xx.xx or xxx)");
    }
  }

  function getReason(val) {
    setReason(val.target.value);
    console.log(val.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentPenaltyCount = await getPenaltyCount(); // Fetch the current penalty count
    const formattedPenaltyCount = `R${String(currentPenaltyCount + 1)}`; // Generate the penaltyId

    let subjects;
    if (value === 'a') {
      subjects = 'Penalty Notification - Compensate';
    } else if (value === 'b') {
      subjects = 'Penalty Notification - Grant Permission';
    }

    let reasons;
    if (value === 'a') {

      reasons = `Reason: ${reason}, \nDate: ${new Date().toISOString()}, \nCompensate Amount: RM ${compensate}`;
    } else if (value === 'b') {
      reasons = `Reason: ${reason}, \nYou are not able to rent from Start Date: ${startDateTime} to End Date: ${endDateTime}`;
    }

    const templateParams = {
      user_name: name,
      to_email: email,
      subject: subjects,
      reason: reasons,
    };

    await sendEmail(templateParams);



    if (value === 'a') {
      console.log(
        `${formattedPenaltyCount} / ${id} / ${items.find((item) => item.value === value).label} / ${compensate} / ${reason} / ${new Date().toISOString()} / ${new Date().toISOString()}`
      );

      const { data, error } = await supabase
        .from('penalty')
        .insert([
          {
            penaltyId: formattedPenaltyCount,
            type: items.find((item) => item.value === value).label,
            comAmount: compensate,
            reason: reason,
            penaltyStartDate: null,
            penaltyEndDate: null,
            schoolId: id
          }
        ])

      if (error) {
        console.error('Error inserting data: ', error);
      } else {
        console.log('Data inserted successfully: ', data);
        // setTimeout(() => {
        //   setCompensateMessage(true);
        //   console.log("Send Compensate successful");

        //   setTimeout(() => {
        //     setCompensateMessage(false);
        //   }, 5000)
        // }, 4000);
        toggleModal();

      }
    } else if (value === 'b') {
      console.log(
        `${formattedPenaltyCount} / ${id} / ${items.find((item) => item.value === value).label} / ${startDateTime} / ${endDateTime} / ${reason}`
      );

      const { data, error } = await supabase
        .from('penalty')
        .insert([
          {
            penaltyId: formattedPenaltyCount,
            type: items.find((item) => item.value === value).label,
            comAmount: null,
            reason: reason,
            penaltyStartDate: new Date().toISOString(),
            penaltyEndDate: new Date().toISOString(),
            schoolId: id
          }
        ])

      if (error) {
        console.error('Error inserting data: ', error);
      } else {
        console.log('Data inserted successfully: ', data);
        // setTimeout(() => {
        //   setPermissionMessage(true);
        //   console.log("Send Penalty successful");

        //   setTimeout(() => {
        //     setPermissionMessage(false);
        //   }, 5000)

        // }, 4000);
        toggleModal();

      }
    }
  };


  return (
    <div>
      <div className="form-header">
        <h1>Impose Penalty</h1>
        <h4>
          <span>User ID : </span>
          <span>{id}</span>
        </h4>
      </div>
      <form ref={form} onSubmit={handleSubmit}>
        {/* Display Options  */}
        <div className="form-group radio-group">
          {items.map(item => (
            <div key={item.value}>
              <label>
                {item.label}
                <input
                  type="radio"
                  value={item.value}
                  checked={value === item.value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>

        {/* Display Compensate */}
        <div>
          {value === 'a' && (
            <div>
              <Container>
                <Input type="text" placeholder=' ' onChange={getCompensate} />
                <Label>Compensate Amount (RM) </Label>
              </Container>

              <p style={styles.errorMsg}>{compensateError}</p>
            </div>
          )}
        </div>

        {/* Display Calender */}
        <div>
          {value === 'b' && (
            <div>
              <DateTimePicker
                label='Start Date and Time'
                TextField={(params) => <TextField {...params} />}
                value={dayjs(startDateTime)}
                onChange={(newValue) => setStartDateTime(newValue)}
              />

              <p>Start Date and Time : {dayjs(startDateTime).format('DD/MM/YYYY, HH:mm A')}</p>

              <DateTimePicker
                label='End Date and Time'
                TextField={(params) => <TextField {...params} />}
                value={dayjs(endDateTime)}
                onChange={(newValue) => setEndDateTime(newValue)}
              />

              <p>End Date and Time : {dayjs(endDateTime).format('DD/MM/YYYY, HH:mm A')}</p>

              {/* Display Time Difference */}
              {calculateTimeDifference() === null ? null : (
                <p>
                  {calculateTimeDifference() === 'Error'
                    ? <span style={styles.errorMsg}>Invalid, Date and Time cannot be NEGATIVE</span>
                    : `${id} will not be able to rent scooter for: ${calculateTimeDifference()}`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Display Reason Text Input */}
        <div>
          <Container>
            <Input type="text" placeholder=' ' onChange={getReason} />
            <Label>Reason</Label>
          </Container>
        </div>

        <div className="button-group">
          <button onClick={toggleModal} className="cancel">Cancel</button>
          <button type="submit">Submit</button>
        </div>

      </form>

      {/* {showCompensateMessage && (
        <div className="success-message">
          <p>Send Compensate successful!</p>
        </div>
      )}

      {showPermissionMessage && (
        <div className="success-message">
          <p>Send penalty successful!</p>
        </div>
      )} */}

    </div>
  );
}

const styles = {
  errorMsg: {
    color: 'red',
  },
}



//-------------------------reason input box-------------------------

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Input = styled.input`
    width: 100%;
    padding: 1rem 1.2rem;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 1rem;
    outline-color: transparent;

    &:focus {
        border: 3px solid #0000FF;
    }

    &:not(:placeholder-shown) + span,
    &:focus + span {
        color: #0000FF;
        transform: translateX(10px) translateY(-25px);
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0 6px;
        background-color: #fff;
    }

    &:not(:focus) + span {
        color: #808080;
    }
`
const Label = styled.span`   
    position: absolute;
    left: 0;
    padding-left: 1.2rem;
    font-size: 1rem;
    color: #7f8fa6;
    pointer-events: none;
    transition: 0.6s;
`
//---------------------------------------------------------------------------