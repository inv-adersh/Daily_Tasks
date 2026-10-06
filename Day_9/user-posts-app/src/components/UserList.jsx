import UserCard from "./UserCard";

function UserList({ users, onSelect }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

export default UserList;