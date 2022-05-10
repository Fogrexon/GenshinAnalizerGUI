import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocalFile } from '../utils/getLocalFile'

export const Home = () => {
  const [path, setPath] = useState('')

  return (
    <div className="container">
      <h1>Home</h1>
      <input
        type="button"
        value={'ファイルを選択'}
        onChange={() => {
          getLocalFile().then(path => {
            setPath(path)
          })
        }}
        accept=".mp4"
      />
      <video src={path} controls />
      <Link to="/loading">Analyze</Link>
    </div>
  )
}
