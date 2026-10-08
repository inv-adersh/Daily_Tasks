
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PostList from "../src/components/PostList";
import Loader from "../src/components/Loader";
import ErrorMessage from "../src/components/ErrorMessage";


function PostsPage() {

    const { userId } = useParams();

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function fetchPosts() {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }

            const data = await response.json();
            setPosts(data);

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [userId]);


    return (
        <div>

            <button className="bg-gray-200 p-1 rounded-xl border-3 border-black shadow-lg mt-6 ml-4 pl-2 pr-2" onClick={() => navigate("/")}>
                ← Back to Users
            </button>

            <h1 className="text-center text-4xl font-bold mt-4 mb-6">Posts</h1>

            {loading ? <Loader />
                : error ? <ErrorMessage message={error} onRetry={fetchPosts} />
                    : <PostList posts={posts} />
            }

        </div>
    );
}

export default PostsPage;