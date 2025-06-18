import React from 'react'

type ErrorMassage = {
  message: string
}

const ErrorScreen = (message: ErrorMassage) => {
  return (
    <>
      <style>
        {`
          .error-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
          }
          .error-container {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 90%;
            text-align: center;
          }
          .error-title {
            color: #d32f2f;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .error-message {
            color: #333;
            margin-bottom: 1.5rem;
          }
          .retry-button {
            background-color: #1976d2;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          .retry-button:hover {
            background-color: #1565c0;
          }
        `}
      </style>
      <div className='error-screen'>
        <div className='error-container'>
          <h1 className='error-title'>Something went wrong</h1>
          <p className='error-message'>
            message || 'An unexpected error occurred. Please try again later.'
          </p>
          <button className='retry-button' onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    </>
  )
}

export default ErrorScreen
