import "./home.scss";
import "./getPost.scss";
import Post from "../post/Post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {useLocation} from "react-router-dom";
import { makeRequest } from "../../axios";

const GetPost = (id) => {
    const postId = useLocation().pathname.split("/")[2] || id ;
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery(["get_post", postId], () =>
        makeRequest.get("/posts/" + postId).then((res) => {
            return res.data;
        })
    );

    return (
        <div className="getPost">
            {error
                ? "Something went wrong!"
                : isLoading
                    ? "loading"
                    : data.map((post) => <Post post={post} key={post.id} />)}
        </div>
    );
};

export default GetPost;
