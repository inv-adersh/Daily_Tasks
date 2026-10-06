function UserCard({user,onSelect }) {
    return (
        <div className="bg-gray-200  p-6 rounded-xl border-3 border-black shadow-lg">

            <h3 className="text-xl font-semibold ">{user.name}</h3>
            <p className="pt-4 text-">Username : {user.username}</p>
            <p>Email   : {user.email}</p>

            <button className="border-2 p-1 border-black-200 rounded-xl mt-2 pl-4 pr-4 hover:bg-gray-400 transition cursor-pointer" 
            onClick={()=>onSelect(user)}>
                View Posts
            </button>
        </div>
    );
}

export default UserCard;