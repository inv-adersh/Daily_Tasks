import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserList from "../src/components/UserList";
import Loader from "../src/components/Loader";
import ErrorMessage from "../src/components/ErrorMessage";


function UsersPage() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function fetchUsers() {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            setUsers(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    function handleUserSelect(user) {
        navigate(`/posts/${user.id}`);
    }

    return (
        <div>

            <h1 className="text-5xl font-bold text-black mb-6 mt-4 text-center" >Users</h1>

            {loading ? <Loader />
             : error ? <ErrorMessage message={error} onRetry={fetchUsers}/>
             : <UserList users={users} onSelect={handleUserSelect}/>}

        </div>
    );
}

export default UsersPage;