function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p>{message}</p>

            <button onClick={onRetry} className="border-2 border-black rounded-xl p-1 bg-gray-200 mt-6 pl-5 pr-5 cursor-pointer hover:bg-gray-400">
                Retry
            </button>
        </div>
    );
}

export default ErrorMessage;