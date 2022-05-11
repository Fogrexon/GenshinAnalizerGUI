import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Loading = () => {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(value => {
        if (value > 1) {
          navigate('/result')
        }
        return value + 0.01
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container justify-center items-center flex">
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${Math.floor(progress * 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
