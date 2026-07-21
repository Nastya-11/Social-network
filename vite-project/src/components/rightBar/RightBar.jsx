import "./rightBar.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Suggestions from "../../assets/15.png";

const RightBar = ({ userId, handleFollow, handleUnfollow }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const targetUserId = userId || currentUser?.id;

  const [followingUsers, setFollowingUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!targetUserId) return;

      try {
        const response = await axios.get("http://localhost:8800/api/relationships/followers", {
          params: { followedUserId: targetUserId },
          withCredentials: true,
        });
        console.log("Followers:", response.data);
        setFollowers(response.data);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [targetUserId]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!targetUserId) return;

      try {
        const response = await axios.get("http://localhost:8800/api/relationships/followings", {
          params: { followerUserId: targetUserId },
          withCredentials: true,
        });
        console.log("Following users:", response.data);
        setFollowingUsers(response.data);
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };

    fetchFollowing();
  }, [targetUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/users/new");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching new users:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
        <div style={{ display: "flex", alignItems: "center" }}>
            <img src={Suggestions} alt="" style={{ width: "30px", marginRight: "12px"}} />
            <span>Suggestions for you!</span>
          </div>
          {data.length > 0 && (
            <ul style={{ marginTop: "20px", listStyleType: "none", padding: 0 }}>
              {data.map((user) => (
                <li
                  key={user.id}
                  style={{
                    marginBottom: "13px",
                    padding: "10px",
                    backgroundColor: "#2c313c",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="userInfo">
                      <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>{user.name}</span>
                    </div>
                    <button
                      onClick={() => window.location.href = `/profile/${user.id}`}
                      style={{
                        marginTop: "6px",
                        width: "25%",
                        padding: "7px",
                        backgroundColor: "rgb(128, 4, 4)",
                        color: "white",
                        fontSize: "14px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="item">
          <span>Followers</span>
          {followers.length > 0 ? (
            <ul style={{ marginTop: "20px", listStyleType: "none", padding: 0 }}>
              {followers.map((follower) => (
                <li
                  key={follower.id}
                  style={{
                    marginBottom: "13px",
                    padding: "10px",
                    backgroundColor: "#2c313c",
                    borderRadius: "8px",
                    transition: "transform 0.3s",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="userInfo">
                      <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>{follower.name}</span>
                    </div>
                    <button
                      onClick={() => window.location.href = `/profile/${follower.id}`}
                      style={{
                        marginTop: "6px",
                        width: "25%",
                        padding: "7px",
                        backgroundColor: "rgb(128, 4, 4)",
                        color: "white",
                        fontSize: "14px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p 
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#2c313c",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "15px",
              borderRadius: "5px",
              textAlign: "center",
            }}
            >No followers</p>
          )}
        </div>

        <div className="item">
          <span>Following</span>
          {followingUsers.length > 0 ? (
            <ul style={{ marginTop: "20px", listStyleType: "none", padding: 0 }}>
              {followingUsers.map((user) => (
                <li
                  key={user.id}
                  style={{
                    marginBottom: "13px",
                    padding: "10px",
                    backgroundColor: "#2c313c",
                    borderRadius: "8px",
                    transition: "transform 0.3s",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="userInfo">
                      <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>{user.name}</span>
                    </div>
                    <button
                      onClick={() => window.location.href = `/profile/${user.id}`}
                      style={{
                        marginTop: "6px",
                        width: "25%",
                        padding: "7px",
                        border: "none",
                        backgroundColor: "rgb(128, 4, 4)",
                        color: "white",
                        fontSize: "14px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p 
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#2c313c",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "15px",
              borderRadius: "5px",
              textAlign: "center",
            }}
            >Not following anyone</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
