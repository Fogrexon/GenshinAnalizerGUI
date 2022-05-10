import { useEffect, useRef } from 'react'

const showCanvas = (canvas: HTMLCanvasElement, result: AnalyzeResult) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas
  let animation = -1
  const tick = () => {
    animation = requestAnimationFrame(tick)
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(0, height)
    result.damages.map(({ total }, index) => {
      ctx.lineTo(
        (width * index) / result.damages.length,
        height - (height * total) / 200000
      )
    })
    ctx.moveTo(width, height)
    ctx.fill()
  }
  tick()

  return () => {
    cancelAnimationFrame(animation)
  }
}

export const AnalyzeResultViewer = ({
  result
}: {
  result: AnalyzeResult | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current || !result) return
    return showCanvas(canvasRef.current, result)
  }, [result])

  return <canvas ref={canvasRef} width="500" height="100"></canvas>
}
