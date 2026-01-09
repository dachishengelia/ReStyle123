import React from 'react'

export default function Cancel() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled ✖</h1>
      <p className="mt-4 text-lg text-gray-700">Your payment was not completed.</p>
    </div>
  );
}

 