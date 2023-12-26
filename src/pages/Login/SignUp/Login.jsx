import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import '../../../css/login.css'

// Image
import Line from '../../../img/line-17.svg'

const Login = ({ setToken }) => {
  let navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true); // Set loading state to true

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      setToken(data);
      navigate('/dashboard');

    } catch (error) {
      alert(error);
    } finally {
      setLoading(false); // Set loading state back to false
    }
  }

  return (
    <div className="login-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="title-box">
            <div className="title">Scooter Rental</div>
          </div>

          <div className="login-form">
            <div className="div">Please Enter Your Information</div>
            <img className="line" src={Line} alt="Line" />
            <form className="details-form" autoComplete="off" onSubmit={handleSubmit}>
              <input id="email" autoComplete="off" placeholder='Staff email' name='email' onChange={handleChange} />

              <input id="password" autoComplete="off" placeholder='Password' name='password' type="password" onChange={handleChange} />

              <div className="buttonPosition">
                <button id='login' type='submit' value='login' disabled={loading}>
                  <b>{loading ? 'Logging in...' : 'Login'}</b>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
