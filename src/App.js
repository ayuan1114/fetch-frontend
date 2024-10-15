import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import AsyncSelect from "react-select/async"
import { DynamGallery }  from "./DynamGallery.js"

function App() {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOption] = useState([]);
  const [seed, setSeed] = useState(1);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleChange = (options) => {
    setSelectedOption(options);
  };

  const loadOptions = async (inputValue) => {
    inputValue = inputValue.toLowerCase()
    return axios.get(`https://dog.ceo/api/breeds/list/all`).then((res) => {
      let dog_breeds = []
      for (const [key, value] of Object.entries(res.data.message)) {
        if (value.length > 0) {
          value.forEach(function(item) {
            if ((item + " " + key).includes(inputValue)) {
              dog_breeds.push({ label: item[0].toUpperCase() + item.slice(1) + " " + key[0].toUpperCase() + key.slice(1), value: key + "/" + item })
            }
          })
        }
        else {
          if (key.includes(inputValue)) {
            dog_breeds.push({ label: key[0].toUpperCase() + key.slice(1), value: key })
          }
        }
      };
      return dog_breeds
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: 500,
    }),
    control: (provided) => ({
      ...provided,
      color: '#000', // Customize input text color here
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#FFF' : '#000', // Font color for options
      backgroundColor: state.isSelected ? '#007BFF' : '#FFF', // Background color for selected and non-selected
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: 'left',  // Align placeholder text to the left
      color: '#aaa',  // Customize placeholder color (optional)
    }), 
    singleValue: (provided) => ({
      ...provided,
      color: '#000', // Font color of selected option
    }),
  };

  return (
    <div className="App">
      {/* Header Section */}
      <header className="App-header">
        <h2>Dog Gallery</h2>
        <h3>Input Dog Breeds Below</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AsyncSelect
            cacheOptions
            defaultOptions
            isMulti
            className="search-bar"
            value={selectedOptions}
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
            styles={customStyles}
            placeholder="Enter dog breeds here"
          />
          <button onClick={() => setSeed(-seed)}>Refresh</button>
        </div>
      </header>

      {/* Main Section */}
      <main className="App-main">
        <DynamGallery
          options={selectedOptions}
          seed={seed}/>
      </main>

      {/* Footer Section */}
      <footer className="App-footer">
        <p>© 2024 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
