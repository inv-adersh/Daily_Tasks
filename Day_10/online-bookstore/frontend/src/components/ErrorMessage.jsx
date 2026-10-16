function ErrorMessage({ message, onRetry }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="my-4 rounded-md border border-red-200 bg-red-50 p-4"
      role="alert"
    >
      <p className="text-sm text-red-700">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-semibold text-red-700 underline hover:text-red-900"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;