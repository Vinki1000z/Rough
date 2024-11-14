'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error | unknown;  // Using `any` as a fallback for unknown error types
  reset: () => void;   // Ensuring reset is typed correctly
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>
        Try again
      </button>
    </div>
  )
}
