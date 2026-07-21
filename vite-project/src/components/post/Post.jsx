import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useLocation } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Post = ({ post }) => {
  const { postId } = useParams();
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [postIdFromUrl, setPostIdFromUrl] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleShareClick = () => {
    const shareURL = `http://localhost:5173/get_post/${post.id}`; 

    navigator.clipboard
      .writeText(shareURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err);
      });
  };

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split("/");
    const potentialPostId = pathSegments[pathSegments.length - 1];

    if (potentialPostId && !isNaN(potentialPostId)) {
      setPostIdFromUrl(potentialPostId);
    }
  }, []); 

  return (
    <div className="post">
      {isLoading ? (
        <p>Loading post...</p>
      ) : (
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <img
                src={
                  post.profilePic
                    ? "/upload/" + post.profilePic
                    : "https://via.placeholder.com/150x150"
                }
                alt=""
              />
              <div className="details">
                <Link
                  to={`/profile/${post.userId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{post.name}</span>
                </Link>
                <span className="date">{moment(post.createdAt).fromNow()}</span>
              </div>
            </div>
            {post.userId === currentUser.id && (
              <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
            )}
            {menuOpen && <button onClick={handleDelete}>Delete</button>}
          </div>
          <div className="content">
            <p>{post.desc}</p>
            <img src={"/upload/" + post.img} alt="" />
          </div>
          <div className="info">
            <div className="item">
              {data.includes(currentUser.id) ? (
                <FavoriteOutlinedIcon
                  style={{ color: "red" }}
                  onClick={handleLike}
                />
              ) : (
                <FavoriteBorderOutlinedIcon onClick={handleLike} />
              )}
              {data?.length} Like
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              Comments
            </div>
            <div className="item" onClick={handleShareClick}>
              <ShareOutlinedIcon />
              Share
              {copied && (
                <ContentCopyIcon fontSize="small" sx={{ color: "green" }} />
              )}
            </div>
          </div>
          {commentOpen && <Comments postId={post.id} />}
        </div>
      )}
    </div>
  );
};

export default Post;
