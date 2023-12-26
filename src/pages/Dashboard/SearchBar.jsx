import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

import "../../css/SearchResult.css";
import "../../css/SearchResultsList.css";
import "../../css/SearchBar.css";

export const SearchBar = ({ setResults }) => {

  const [input, setInput] = useState("");

  const fetchData = async (value) => {
    try {
      console.log('Fetching data from Supabase...');
      const { data: user, error } = await supabase
        .from('user')
        .select('username')
        .textSearch('username', `${value}`)



      if (error) {
        console.error('No such data from Supabase:', error);
      } else {
        console.log(value);
        console.log('Users from Supabase:', user);
        setResults(user);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        className="search-input"
        placeholder="Search user..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export const SearchResultsList = ({ results }) => {
  console.log("list", results)
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.username} key={id} />;
      })}
    </div>
  );
};

export const SearchResult = ({ result }) => {
  console.log(result)
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('schoolId, username')
        .eq('username', result)
        .single()

      if (data) {
        const user_id = data.schoolId
        navigate(`/userDetails/${user_id}`)
      } else {
        console.log("No such user found");
      }
    } catch (error) {
      console.error("Error comparing data:", error.message)
    }
  }


  return (
    <div
      className="search-result"
      onClick={handleClick}
    >
      {result}
    </div>
  );
};