import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

//https://hhdihrpmwxaycjjsjusf.supabase.co/storage/v1/object/public/test/parking/P001/Block%20D%20.png

const CDNURL = "https://hhdihrpmwxaycjjsjusf.supabase.co/storage/v1/object/public/test/parking/";

//CDNURL + "/" + scooterId + "/" + image.name 


function Parking({ toggleModal, scooterId, location }) {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  async function getImages() {
    const { data, error } = await supabase.storage
      .from('test')
      .list("parking/" + scooterId + "/", {
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

  useEffect(() => {
    getImages();
  }, [])

  return (
    <div>
      <h1>Parking</h1>

      <p>
        <span>Location : </span>{location}
      </p>

      {images.map((image) => (
        <div key={image.name}>
          <img
            src={CDNURL + "/" + scooterId + "/" + image.name}
            style={styles.image}
            alt={image.name}
          />
        </div>
      ))}

      <button className='done' onClick={toggleModal}>Done</button>
    </div>
  );
}

export default Parking;

const styles = {
  image: {
    width: 400,
    height: 400,
  },
};
