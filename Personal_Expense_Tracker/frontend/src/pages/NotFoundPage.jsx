import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">

        {/* 404 illustration */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold tracking-tight text-indigo-600">
            404
          </h1>

          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-indigo-600" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-slate-800">
          Page Not Found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Oops! The page you're looking for doesn't exist or may have been
          moved. Let's get you back on track with your finances.
        </p>

        {/* Return to dashboard */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2
          rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white
          shadow-sm transition hover:bg-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:ring-offset-2"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        {/* Footer message */}
        <p className="mt-8 text-xs text-slate-400">
        Personal Finance Tracker
        </p>

      </div>
    </div>
  );
}

export default NotFoundPage;