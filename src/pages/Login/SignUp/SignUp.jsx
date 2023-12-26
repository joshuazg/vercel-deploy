import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  console.log(formData);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const handleUpload = async () => {
    if (selectedFile) {
      const { data, error } = await supabase.storage
        .from('test')
        .upload(formData.email + '/' + selectedFile?.name, selectedFile);

      if (data) {
        console.log(data);
        // Refresh the list of images after successful upload
      } else if (error) {
        console.log(error);
      }
    }
  };


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });
      console.log(data);

      if (error) throw error;
      alert('Check your email for verification link');
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Fullname"
          name="fullName"
          onChange={handleChange}
        />

        <input placeholder="Email" name="email" onChange={handleChange} />

        <input
          placeholder="Password"
          name="password"
          type="password"
          onChange={handleChange}
        />

        <div>
          <p>
            <input
              type="file"
              accept="image/*"
              id="file_input"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </p>
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          )}
          <p>
            <button onClick={handleUpload}>Upload Image</button>
          </p>
        </div>

        <button type="submit">Submit</button>
      </form>
      Already have an account?<Link to="/">Login</Link>
    </div>
  );
};

export default SignUp;
