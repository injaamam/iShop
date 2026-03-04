import { Link, useSearchParams } from "react-router-dom";
import {
  MdBuild,
  MdOutlineWarningAmber,
  MdSupportAgent,
  MdOutlineShoppingBag,
  MdArrowForward,
} from "react-icons/md";

function FeatureUnavailablePage() {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get("feature") || "This feature";

  return (
    <div className="min-h-[calc(100vh-72px)] px-5 md:px-8 lg:px-10 py-10 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {/* left column */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <MdOutlineWarningAmber size={26} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600">
                    Feature unavailable
                  </p>
                  <span className="text-sm text-slate-500">
                    Temporary — we&apos;ll be back soon
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  {feature} is not ready yet
                </h1>
                <p className="mt-3 text-slate-600">
                  We&apos;re working on this feature right now. While it&apos;s
                  unavailable, you can still browse products and continue
                  shopping normally.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 text-white px-5 py-3 font-medium hover:bg-orange-600 transition"
                >
                  Back to home <MdArrowForward size={18} />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-800 px-5 py-3 font-medium hover:bg-slate-200 transition"
                >
                  Browse all products
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-500">
                <MdBuild size={18} className="shrink-0" />
                <span>
                  We&apos;re continuously improving iShop. Thanks for your patience
                  while we finish this.
                </span>
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-md p-6 md:p-10 flex flex-col justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                What you can do right now
              </h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <MdOutlineShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Keep shopping</p>
                    <p className="text-sm text-slate-600">
                      Explore categories and find the best deals available now.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <MdSupportAgent size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Need help?</p>
                    <p className="text-sm text-slate-600">
                      If you have questions, our team is here to support you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-100 p-4">
              <p className="text-sm text-slate-700">
                You tried to open{" "}
                <span className="font-semibold text-slate-900">{feature}</span>.
                We&apos;ll enable it as soon as it&apos;s ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureUnavailablePage;
