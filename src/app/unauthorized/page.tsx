import Link from "next/link";

export default function Unauthorized() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-red-600">401</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Intruder! Unauthorized.
        </h2>
        <p className="text-gray-600 mt-2">
          Sorry, You do not have permission to access this page.
        </p>
        <div className="mt-6">
          <Link href="/" passHref>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Go back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
    );
  }
  