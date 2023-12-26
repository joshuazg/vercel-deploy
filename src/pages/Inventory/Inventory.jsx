import { supabase } from "../../supabaseClient"
import { useEffect, useState } from "react"

import '../../css/inventory.css'

//Pages
import Header from "../Header"
import Algo from "./algo"
import GenerateReport from "./GenerateReport"

//Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const DeleteConfirmationForm = ({ onDelete, onCancel }) => {
  const [deleteQuantity, setDeleteQuantity] = useState(1);

  const handleDelete = () => {
    onDelete(deleteQuantity);
  };

  return (
    <div className="delete-confirmation-form">
      <label htmlFor="deleteQuantity">Quantity to Delete:</label>
      <input
        type="number"
        id="deleteQuantity"
        value={deleteQuantity}
        onChange={(e) => setDeleteQuantity(parseInt(e.target.value))}
        min="1"
      />
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

const InventoryCard = ({ inventories, onDelete, onUpdate }) => {

  const handleDelete = () => {
    onDelete(inventories.id);
  };

  return (
    <tbody>
      <tr>
        <td>{inventories.id}</td>
        <td>{inventories.name}</td>
        <td>{inventories.quantity}</td>
        <td>{inventories.status}</td>
        <td ><button style={updateButtonStyle} className="updateTD" onClick={onUpdate}>update</button></td>
        <td><button style={deleteButtonStyle} className="deleteTD" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
        </td>
      </tr>
    </tbody>

  )
}

const Inventory = ({ token }) => {

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [formError, setFormError] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  //Form Displaying
  const [showAddForm, setAddForm] = useState(false);
  const [showDeleteForm, setDeleteForm] = useState(false);
  const [showNewStockName, setNewStockName] = useState('');
  const [showNewStockInput, setNewStockInput] = useState(false);

  // Pagination of Add
  const [currentAddPage, setCurrentAddPage] = useState('add');

  //Render fetch
  const [itemNames, setItemNames] = useState([]);
  const [inventory, setInventory] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  //Message of process
  const [showAddSuccess, setAddSuccess] = useState(false);
  const [showUpdateSuccess, setUpdateSuccess] = useState(false);
  const [showReportSuccess, setReportSuccess] = useState(false);
  const [showDeleteSuccess, setDeleteSuccess] = useState(false);

  const metadata = [
    { key: 'full_name', value: token.user.user_metadata.full_name },
    { key: 'email', value: token.user.email }
  ];

  const handleReport = () => {
    setReportSuccess(true)
  };

  const handleReportClick = () => {
    setReportSuccess(false);
  };

  const handlePageChange = (page) => {
    setCurrentAddPage(page);
  };

  const handleAddClick = () => {
    setAddForm(true);
  };

  const handleAddCancel = () => {
    setAddForm(false);
    setName('');
    setNewStockInput(false);
    setNewStockName('');
    setQuantity('');
    setFormError(null);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setDeleteForm(true);
  };

  const handleDeleteCancel = () => {
    setDeleteItemId(null);
    setDeleteForm(false);
  };

  const handleDeleteConfirmed = async (quantity) => {
    try {
      // Perform deletion based on the specified quantity
      await handleDecrement(deleteItemId, quantity);

      // Clear delete state
      setDeleteItemId(null);
      setDeleteForm(false);
      setTimeout(() => {
        setDeleteSuccess(true);
        console.log("Delete successful");

        setTimeout(() => {
          setDeleteSuccess(false);
        }, 5000)
      }, 1000);
    } catch (error) {
      console.error('Error deleting data:', error.message);
      setFormError('Error deleting data. Please check console for details.');
    }
  };

  const handleDecrement = async (itemId, quantityToDelete) => {
    try {
      // Fetch the existing quantity
      const { data: existingData, error: existingError } = await supabase
        .from("inventory")
        .select('quantity')
        .eq('id', itemId)
        .single();

      if (existingError) {
        console.error('Error fetching existing quantity:', existingError.message);
        setFormError('Error fetching existing quantity. Please check console for details.');
        return;
      }

      const existingQuantity = existingData ? existingData.quantity : 0;

      // Ensure the quantity doesn't go below 0
      const newQuantity = Math.max(existingQuantity - quantityToDelete, 0);

      // Determine the status based on the new quantity
      const newStatus = newQuantity < 30 ? 'Running Low' : 'In Stock';

      // Update the database with the new quantity and status
      const { data, error } = await supabase
        .from("inventory")
        .update({ quantity: newQuantity, status: newStatus })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating data:', error.message);
        setFormError('Error updating data. Please check console for details.');
      }

      if (data) {
        console.log(data);
        setFormError(null);

        const updatedInventory = inventory.map(item => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity, status: newStatus };
          }
          return item;
        });
        setInventory(updatedInventory);
      }
    } catch (error) {
      console.error('Error updating data:', error.message);
      setFormError('Error updating data. Please check console for details.');
    }
  };

  const handleUpdate = async (itemId) => {
    try {
      // Fetch the existing quantity
      const { data: newData, error: existingError } = await supabase
        .from("inventory")
        .select()
        .order("id")

      if (existingError) {
        console.error('Error loading new data:', existingError.message);
      }

      if (newData) {
        setInventory(newData);
        setTimeout(() => {
          setUpdateSuccess(true);
          console.log("Update successful");

          setTimeout(() => {
            setUpdateSuccess(false);
          }, 5000)
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating data:', error.message);
      setFormError('Error updating data. Please check console for details.');
    }
  };

  const fetchMaxId = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select('count');

    if (error) {
      console.error('Error fetching max id:', error.message);
      return null;
    }

    console.log("what this", data)

    return data[0].count;
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!quantity) {
      setFormError('Please fill in the fields correctly');
      return;
    }

    try {
      setFormError(null);

      if (showNewStockInput && showNewStockName) {
        // Handle the case when adding a new stock
        const maxId = await fetchMaxId();
        const newId = maxId + 1;
        console.log("id", newId)
        const newStatus = quantity < 30 ? 'Running Low' : 'In Stock';


        try {
          const { data, error } = await supabase
            .from("inventory")
            .insert([{ id: newId, created_at: new Date().toISOString(), name: showNewStockName, quantity: parseInt(quantity), status: newStatus }])

          if (error) {
            console.error('Error inserting new stock data:', error.message);
            setFormError('Error inserting new stock data. Please check console for details.');
            return;
          } else {
            // setFormError(null);
            setAddForm(false);
            setNewStockInput(false); // Reset the state
            setTimeout(() => {
              setAddSuccess(true);
              console.log("Add new stock successful");

              setTimeout(() => {
                setAddSuccess(false);
              }, 5000)
            }, 1000);
          }
        } catch (error) {
          console.error('Error handling new stock insertion:', error.message);
          setFormError('Error handling new stock insertion. Please check console for details.');
        }
      } else {
        // Handle the case when updating an existing item
        const { data: existingData, error: existingError } = await supabase
          .from("inventory")
          .select('quantity')
          .eq('name', name)
          .single();

        if (existingError) {
          console.error('Error fetching existing quantity:', existingError.message);
          setFormError('Error fetching existing quantity. Please check console for details.');
          return;
        }

        const existingQuantity = existingData ? existingData.quantity : 0;
        const newQuantity = existingQuantity + parseInt(quantity);
        const newStatus = newQuantity < 30 ? 'Running Low' : 'In Stock';

        const { data, error } = await supabase
          .from("inventory")
          .update({ quantity: newQuantity, status: newStatus })
          .eq('name', name);

        if (error) {
          console.error('Error updating data:', error.message);
          setFormError('Error updating data. Please check console for details.');
        } else {
          setFormError(null);
          setAddForm(false);
          setTimeout(() => {
            setAddSuccess(true);
            console.log("Add stock successful");

            setTimeout(() => {
              setAddSuccess(false);
            }, 5000)
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error handling submit:', error.message);
      setFormError('Error handling submit. Please check console for details.');
    }
  };

  useEffect(() => {
    // Fetching inventory item
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select()
        .order("id")


      if (error) {
        setFetchError('Could not fetch the inventory')
        console.log(error)
      }
      else if (data) {
        setInventory(data)
        setFetchError(null)
      }
    }

    // Fetch add items name
    const fetchItemNames = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select('name')
        .order('id'); // Fetch only the 'name' column

      if (error) {
        console.error('Error fetching item names:', error.message);
      } else if (data) {
        // Extract names from the fetched data
        const names = data.map(item => item.name);
        setItemNames(names);
      }
    };

    fetchItemNames()
    fetchInventory()
  }, [])

  return (
    <div className="inventory">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <Header token={metadata} />
          </div>
          <div className="caption">Inventory</div>
          <div className="right-caption" >
            <button className="add-button" onClick={handleAddClick}>Add Stock</button>
            <button className="generate-report" onClick={handleReport}>Generate</button>
          </div>

          {/* Error of fetching inventory items */}
          {fetchError && (<p>{fetchError}</p>)}

          {/* Fetching inventory items */}
          {inventory && (
            <div className="item">
              <table className="inventoryTable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                {inventory.map(inventories => (
                  <InventoryCard key={inventories.id} inventories={inventories} onDelete={() => handleDeleteClick(inventories.id)} onUpdate={() => handleUpdate(inventories.id)} />
                ))}
              </table>
            </div>
          )}

          {/* Form for adding inventory */}
          {showAddForm && (
            <div className="overlay">
              <div className="add-form" style={formStyle}>
                <span className={`option ${currentAddPage === 'add' ? 'active' : ''}`} onClick={() => setCurrentAddPage('add')} >Add</span>
                <span>/</span>
                <span className={`option ${currentAddPage === 'upload' ? 'active' : ''}`} onClick={() => setCurrentAddPage('upload')} >Upload Image</span>
                <button style={cancelButtonStyle} onClick={handleAddCancel}>
                  X
                </button>
                {/* Current Page Add */}
                {currentAddPage === 'upload' && (
                  <Algo />
                )}
                {currentAddPage === 'add' && (
                  <form onSubmit={handleAdd}>
                    <label htmlFor="name" style={labelStyle}>Choose:</label>
                    <select
                      id="name"
                      value={name}
                      onChange={(e) => {
                        // Handle the selected value
                        const selectedValue = e.target.value;
                        setName(selectedValue);

                        // Show the input field for the name when "newStock" is selected
                        if (selectedValue === 'newStock') {
                          setNewStockInput(true);
                        } else {
                          setNewStockInput(false);
                        }
                      }}
                      style={inputStyle}
                    >
                      <option value="" disabled>Select a name</option>
                      <option value="newStock">New Stock</option>

                      {itemNames.map((itemName, index) => (
                        <option key={index} value={itemName}>
                          {itemName}
                        </option>
                      ))}
                    </select>
                    <br />

                    {/* Conditionally render the input field for the name */}
                    {showNewStockInput && (
                      <>
                        <label htmlFor="newStockName" style={labelStyle}>New Stock Name:</label>
                        <input
                          type="text"
                          id="newStockName"
                          value={showNewStockName}
                          onChange={(e) => setNewStockName(e.target.value)}
                          style={inputQtyStyle}
                        />
                      </>
                    )}

                    <label htmlFor="quantity" style={labelStyle}>Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      style={inputQtyStyle}
                    />
                    <button style={addButtonStyle}>Add Item</button>

                    {formError && <p className="error" style={errorStyle}>{formError}</p>}
                  </form>
                )}


                {/* Upload Image Add Item */}

              </div>
            </div>
          )}

          {/* Form for delete inventory */}
          {showDeleteForm && (
            <div className="overlay">
              <div className="delete-form" style={formStyle}>
                <DeleteConfirmationForm
                  onDelete={handleDeleteConfirmed}
                  onCancel={handleDeleteCancel}
                />
              </div>
            </div>
          )}

          {/* Message of succesful */}
          {showDeleteSuccess && (
            <div className="success-message">
              <p>Delete successful!</p>
            </div>
          )}

          {showUpdateSuccess && (
            <div className="success-message">
              <p>Update successful!</p>
            </div>
          )}

          {showAddSuccess && (
            <div className="success-message">
              <p>Add Stock Successful!</p>
            </div>
          )}

          {showReportSuccess && (
            <div className="overlay" onClick={handleReportClick}>
              <div className="report" onClick={(e) => e.stopPropagation()}>
                <div className="report-container">
                  <div className="report-title">Report</div>
                  <button className="print-button" onClick={() => window.print()}>Print Report</button>
                  {inventory && (
                    <div className="reportItem">
                      <table className="reportTable">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        {inventory.map((inventories, index) => (
                          <tbody key={index}>
                            <tr>
                              <td>{inventories.id}</td>
                              <td>{inventories.name}</td>
                              <td>{inventories.quantity}</td>
                              <td>{inventories.status}</td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                    </div>
                  )}
                  <GenerateReport />
                </div>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
}

const reportStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle box shadow
  width: '20%',
}

const formStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle box shadow
  width: '20%',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const inputQtyStyle = {
  width: '95%',
  padding: '8px',
  marginBottom: '16px',
  marginLeft: '2px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const errorStyle = {
  color: '#d9534f', // Red color for error messages
};

const addButtonStyle = {
  backgroundColor: '#4CAF50', // Green color
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '5px',
};

const cancelButtonStyle = {
  backgroundColor: '#fff', // Red color
  color: 'black',
  // borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  marginLeft: '125px',
};

const updateButtonStyle = {
  fontWeight: 'bold',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: 'none',
  marginRight: '5px',
  marginTop: '3px',
};

const deleteButtonStyle = {
  marginTop: '10px',
  padding: '10px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: 'none',
};


export default Inventory