import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const CDNURL = "https://hhdihrpmwxaycjjsjusf.supabase.co/storage/v1/object/public/sample/";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ViewScooter({ toggleModal, info, schoolId }) {

  const [images, setImages] = useState([]);
  async function getImages() {
    const { data, error } = await supabase.storage
      .from('sample')
      .list(`scooterSample/`, {
        limit: 10,
        offset: 0,
        sortBy: {
          column: 'name',
          order: 'asc',
        }
      });
  
    if (data) {
      // Sorting the images based on the custom order
      const sortedImages = data.sort((a, b) => {
        const getIndex = (name) => {
          if (name.includes('front')) return 1;
          if (name.includes('right')) return 2;
          if (name.includes('left')) return 3;
          if (name.includes('back')) return 4;
          return 5; // Default order for other images
        };
  
        return getIndex(a.name) - getIndex(b.name);
      });
  
      setImages(sortedImages);
    } else {
      console.log("Failed to retrieve image: ",error);
    }
  }
  

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Scooter ID: {info.scooterId}</h1>
        <h3>Owner: {info.owner}</h3>
      </div>
      <p>
        <span style={styles.bold}>Date: </span>{info.date}
      </p>
      <p>
        <span style={styles.bold}>Time in minutes: </span>{info.totalMinutes} minutes
      </p>
      <p>
        <span style={styles.bold}>Distance: </span>{info.distance} meters
      </p>

      <div style={styles.imageGrid}>
        {images.map((image) => (
          <div key={image.name} style={styles.imageContainer}>
            <img
              src={CDNURL + "/scooterSample/" + "/" + image.name}
              style={styles.image}
              alt={image.name}
            />
            <p style={styles.imageLabel}>{capitalizeFirstLetter(image.name.split('.')[0])} Side</p>
          </div>
        ))}
      </div>

      <button onClick={toggleModal}>Ok</button>
    </div>
  );
}

export default ViewScooter;

const styles = {
  conatiner: {
    maxHeight: '80vh', // Set a max height for the modal content
    overflowY: 'auto', // Add vertical scrollbar when content exceeds the height
    padding: '14px 28px',
    borderRadius: '3px',
    maxWidth: '600px',
    minWidth: '300px',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '10px',
  },
  image: {
    width: 400,
    height: 400,
    border: '2px solid black',
    borderRadius: '8px',
    margin: '10px',
  },
  imageLabel: {
    marginTop: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
};
