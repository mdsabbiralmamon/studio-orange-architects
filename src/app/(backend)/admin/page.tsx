import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-9xl font-extrabold leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
          SOA ADMIN Panel
        </h1>
        <h2 className="text-3xl font-medium mt-4 text-gray-700">
          Studio Orange Architect
        </h2>
      </div>

      {/* Footer Section */}
      <div className="mt-10 text-sm text-gray-600">
        <p className="font-light">
          Developed by <span className="font-semibold">VexStackDigital</span>
        </p>
        <p className="mt-2">
          Created with <span className="text-red-500">❤️</span> by{' '}
          <a
            href="https://vexstack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            VexStack Digital
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
