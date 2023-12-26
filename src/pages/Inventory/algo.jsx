import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import "../../css/algo.css"

const Algo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [totalObjects, setTotalObjects] = useState(0);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [classNames, setClassNames] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDetectObjects = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setDetectedObjects(data.detected_objects);
      setTotalObjects(data.total_objects);
      setSaveButtonDisabled(false);
      const classNamesArray = data.detected_objects.map((object) => object.class_name);
      setClassNames(classNamesArray);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addDetectObjects = async () => {
    try {
      const { data: addObjects, error: failObject } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('name', classNames);

      if (failObject) {
        console.error('Error fetching data:', failObject);  // Corrected variable name
      }

      console.log(classNames)
      const existingQuantity = addObjects ? addObjects[0]?.quantity || 0 : 0;
      const newQuantity = existingQuantity + parseInt(totalObjects);
      const newStatus = newQuantity < 30 ? 'Running Low' : 'In Stock';

      const { data, error } = await supabase
        .from("inventory")
        .update([{ quantity: parseInt(newQuantity), status: newStatus }])
        .eq('name', classNames);

      if (error) {
        console.error('Error updating data:', error.message);
      }else if(data){
        console.log('Successfully added:', data);
      }

    } catch (error) {
      console.error('Error adding data:', error.message);
    }
  };


  return (
    <div className='algo-page'>
      <h2 >Image detection</h2>
      <div className='container'>
        <input className="uploadImage" type="file" accept="image/*" onChange={handleFileChange} />
        <button className='detectImage' onClick={handleDetectObjects} disabled={!selectedFile}>
          Detect Image
        </button>
        <div>
          <span className='result' style={{ fontWeight: 'bold' }} >Total Objects: {totalObjects}</span>
          <ul>
            {detectedObjects.map((object) => (
              <li key={object.object_number}>
                {`Object ${object.object_number}: ${object.class_name} (Confidence: ${object.confidence})`}
              </li>
            ))}
          </ul>
        </div>
        {detectedObjects.length > 0 && (
          <button
            className="saveButton"
            onClick={addDetectObjects}
            disabled={saveButtonDisabled}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Algo;