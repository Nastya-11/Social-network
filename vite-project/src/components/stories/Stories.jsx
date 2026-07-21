import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

// const Stories = () => {
//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   // Fetch all users (replace with your actual user fetching logic)
//   const {
//     isLoading: usersLoading,
//     error: usersError,
//     data: users,
//   } = useQuery(
//     ["users"], // Unique query key for users
//     async () => {
//       const response = await makeRequest.get("/api/users"); // Adjust URL as needed
//       return response.data;
//     }
//   );

//   const { isLoading, error, data } = useQuery(
//     ["stories"], // Unique query key for stories
//     () =>
//       makeRequest.get("/stories").then((res) => {
//         return res.data;
//       })
//   );

//   // Render the current user's story
//   return (
//     <div className="stories">
//       <div className="story">
//         <img src={"/upload/" + currentUser.profilePic} alt="" />
//         <span>{currentUser.name}</span>
//         <button>+</button>
//       </div>

//       {/* Conditionally render user stories based on data availability */}
//       {usersLoading ? (
//         <p>Loading users...</p>
//       ) : usersError ? (
//         <p>Error fetching users: {usersError.message}</p>
//       ) : (
//         users.map((user) => (
//           <div className="story" key={user.id}>
//             <img
//               src={
//                 user.profilePic
//                   ? "/upload/" + user.profilePic
//                   : "/default-avatar.png"
//               }
//               alt=""
//             />
//             <span>{user.name}</span>
//           </div>
//         ))
//       )}

//       {/* Render stories (if available) after all users are fetched */}
//       {isLoading ? (
//         <p>Loading stories...</p>
//       ) : error ? (
//         <p>Error fetching stories: {error.message}</p>
//       ) : (
//         data.map((story) => (
//           <div className="story" key={story.id}>
//             <img src={story.img} alt="" />
//             <span>{story.name}</span>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

export default Stories;
