import { ArrowLeft, Compass } from "lucide-react";

import { Link } from "react-router";

import Button from "../components/ui/Button";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300">
        <Compass size={30} />
      </span>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
        ERROR 404
      </p>

      <h1 className="display-font mt-3 text-3xl font-bold text-white sm:text-4xl">
        This page is off the map.
      </h1>

      <p className="mt-4 max-w-md text-sm leading-7 text-text-secondary">
        We couldn't find the page you requested. Let's get you back to your
        learning journey.
      </p>

      <Link to="/" className="mt-7">
        <Button>
          <ArrowLeft size={16} />
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
