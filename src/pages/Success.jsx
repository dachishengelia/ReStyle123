import React from 'react'

export default function Success() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful ✔</h1>
      <p className="mt-4 text-lg text-gray-700">Thank you for your purchase!</p>
    </div>
  );
}
