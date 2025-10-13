// src/components/Modal.tsx
"use client";

import React from "react";
import Image from "next/image";

interface ModalProps {
  onClose: () => void;
  gifUrl: string;
  title: string;
  description?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, gifUrl, title, description }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white dark:bg-gray-800 p-4 rounded shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute -top-6 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-200 hover:text-gray-300 focus:outline-none focus:ring focus:ring-offset-2"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <Image src={gifUrl} alt={title} width={400} height={300} className="w-full h-auto rounded" unoptimized />
          <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
