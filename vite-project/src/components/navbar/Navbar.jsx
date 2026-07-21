import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!currentUser) {
    return <div>User not found</div>;
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    if (!searchTerm) {
      return;
    }

    const { isLoading, error, data } = useQuery(["users"], () =>
      makeRequest.get("/users?q=" + searchTerm).then((res) => {
        return res.data;
      })
    );

    console.log(data);
  };

  const isSearchByIdEnabled = () => {
    return false;
  };

  return (
    <div className="navbar">
      <div className="left">
      <span>Biker Club</span>
      <HomeOutlinedIcon onClick={() => window.location.href = "/"} style={{ cursor: 'pointer' }} />


        <div className="search">
          <form onSubmit={handleSearchSubmit}>
            <SearchOutlinedIcon />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>
      <div className="right">
          <div className="user">
              <img src={"/upload/" + currentUser.profilePic} alt="" />
              <a href={`/profile/${currentUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span>{currentUser.name}</span>
              </a>
          </div>
          <PersonOutlinedIcon 
              onClick={() => window.location.href = `/profile/${currentUser.id}`} 
              style={{ cursor: 'pointer' }} 
          />
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <div key={result.id || result.message}>
              {" "}
              {result.message ? (
                <span>{result.message}</span> 
              ) : (
                <div className="search-result-item">
                  <img
                    src={"/upload/" + result.profilePic} 
                    alt={result.name}
                    className="search-result-profile-pic"
                  />
                  <div className="search-result-info">
                    <span className="search-result-name">{result.name}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
