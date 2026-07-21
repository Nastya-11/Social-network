import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
// import BlockIcon from "@mui/icons-material/Block";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );
  const { isLoading: isBlockingLoading, data: blockedData } = useQuery(
    ["blocks"],
    () =>
      makeRequest.get("/blocks?blockedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const [isBlocked, setBlocked] = useState(
    blockedData?.includes(currentUser.id)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  const mutationBlock = useMutation(
    (Unblock) => {
      if (Unblock) return makeRequest.delete("/blocks?userId=" + userId);
      return makeRequest.post("/blocks", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["blocks"]);
      },
    }
  );

  const isUserBlocked = blockedData?.some(
    (block) => block.blockedUserId === currentUser.id
  );

  const handleBlock = () => {
    const isUserCurrentlyBlocked = isBlocked;
    mutationBlock.mutate(!isUserCurrentlyBlocked, {
      onSuccess: () => {
        const newIsBlocked = !isUserCurrentlyBlocked;
        setBlocked(newIsBlocked);
  
        localStorage.setItem("isBlocked_" + userId, newIsBlocked.toString());
  
        if (newIsBlocked && relationshipData?.includes(currentUser.id)) {
          handleFollow();
        }
  
        queryClient.invalidateQueries(["blocks"]);
        queryClient.invalidateQueries(["posts"]);
        toast.success(
          newIsBlocked ? "The user has been blocked" : "The user is unblocked"
        );
      },
      onError: () => {
        toast.error(
          isUserCurrentlyBlocked
            ? "Failed to unblock user"
            : "Failed to block user"
        );
      },
    });
  };

  useEffect(() => {
    const storedIsBlocked = localStorage.getItem("isBlocked_" + userId);
    setBlocked(storedIsBlocked === "true");
  }, [userId]);

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <img
              src={"/upload/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
            <div className="left">
                <a href="http://facebook.com" target="_blank">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>

                <a href="http://instagram.com" target="_blank">
                  <InstagramIcon fontSize="large" />
                </a>

                <a href="http://twitter.com" target="_blank">
                  <TwitterIcon fontSize="large" />
                </a>

                <a href="http://linkedin.com" target="_blank">
                  <LinkedInIcon fontSize="large" />
                </a>

                <a href="http://pinterest.com" target="_blank">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>

              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                <div className="buttons">
                  {userId === currentUser.id ? (
                    <button onClick={() => setOpenUpdate(true)}>Update</button>
                  ) : (
                    <>
                      <button
                        disabled={isLoading ? true : rIsLoading}
                        onClick={handleFollow}
                      >
                        {relationshipData?.includes(currentUser.id)
                          ? "Following"
                          : "Follow"}
                      </button>
                      <button
                        disabled={isLoading ? true : isBlockingLoading}
                        onClick={handleBlock}
                      >
                        {isBlocked ? "Unblock" : "Block"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>

            {userId !== currentUser.id && isBlocked ? (
              <div className="blocked-info" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "7vh",
                backgroundColor: "#222",
                color: "white",
                borderRadius: "15px",
                fontSize:"18px",
                textAlign: "center",
                width: "100%"
              }} 
              >The user is blocked</div>
            ) : (
              <Posts userId={userId} isBlocked={isBlocked} />
            )}
          </div>
          {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
        </>
      )}
    </div>
  );
};

export default Profile;
