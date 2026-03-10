import { Link } from "react-router-dom";
import { Construction, ArrowLeft, ShoppingBag } from "lucide-react";

function FeatureUnavailablePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] max-h-[70vh] px-4 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
        <Construction size={38} className="text-[#3749bb]" />
      </div>

      {/* Badge */}
      <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-[#EF4A23] rounded-full mb-4">
        Under Development
      </span>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-[#081621]">Feature Coming Soon</h1>
      <p className="mt-3 text-sm text-gray-400 max-w-sm leading-relaxed">
        We're actively working on this feature and it will be available soon.
        Thank you for your patience!
      </p>

      {/* Divider */}
      <div className="w-16 border-t border-gray-200 my-6" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#081621] rounded hover:bg-[#0f2a3d] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-[#081621] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={16} />
          Browse Products
        </Link>
      </div>
    </div>
  );
}

export default FeatureUnavailablePage;
