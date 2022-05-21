import { useStoredState } from '#/utils/hooks'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocalFile } from '../utils/getLocalFile'

export const Home = () => {
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const [type, setType] = useStoredState<string>('elementType', 'pyro')

  useEffect(() => {
    setType('pyro')
    if (!info || !imgRef.current) return
    const { fps, frame_width, frame_height } = info
    imgRef.current.width = frame_width / 2
    imgRef.current.height = frame_height / 2
    if (interval.current) clearInterval(interval.current)
    window.eel.set_frame(0)
    let blocking = false
    interval.current = setInterval(() => {
      if (blocking) return
      blocking = true
      window.eel.get_frame()((frame: FrameData) => {
        blocking = false
        if (!imgRef.current || !frame) return
        imgRef.current.src = frame.frame
      })
    }, 1000 / fps)

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [info])

  return (
    <div className="container">
      <h1>Home</h1>
      <input
        type="button"
        value={'ファイルを選択'}
        onClick={() => {
          getLocalFile().then(info => {
            console.log(info)
            setInfo(info as VideoInfo)
          })
        }}
        accept=".mp4"
      />
      <div>
        <label htmlFor="elementType">
          ダメージの元素タイプ:
          <select
            id="element-type"
            name="elementType"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="pyro">Pyro</option>
            <option value="cyro">Cyro</option>
            <option value="electro">Electro</option>
            <option value="geo">Geo</option>
            <option value="hydro">Hydro</option>
            <option value="anemo">Anemo</option>
            <option value="physical">Physical</option>
          </select>
        </label>
      </div>
      <img ref={imgRef} alt="video-preview" width="1920" height="1080" />
      <Link to="/result">Analyze</Link>
    </div>
  )
}
