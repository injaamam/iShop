import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-7xl font-bold text-[#081621]">404</h1>
      <p className="mt-3 text-lg font-semibold text-[#081621]">
        Page Not Found
      </p>
      <p className="mt-1 text-sm text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-[#081621] rounded hover:bg-[#0f2a3d] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
