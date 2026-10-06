function PostCard({ post }) {
    return (
        <div className="bg-gray-200 p-4 rounded-xl border-3 border-black shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
        </div>
    );
}

export default PostCard;