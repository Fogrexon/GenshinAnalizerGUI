import { useEffect, useRef } from 'react'

const showCanvas = (canvas: HTMLCanvasElement, result: AnalyzeResult) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    fps,
    frame_count,
    damage_dropout,
    enemy_dropout,
    frame_width,
    frame_height
  } = result
  const { width, height } = canvas
  const maxDamage = result.damages.reduce(
    (prev, value) => Math.max(prev, value.total),
    0
  )
  window.eel.set_frame(0)
  let blocking = false
  const mousemoveHandler = (event: MouseEvent) => {
    if (blocking) return
    const { offsetX } = event
    blocking = true
    window.eel.set_frame(Math.floor((offsetX / width) * frame_count))(() => {
      blocking = false
    })
  }

  canvas.addEventListener('mousemove', mousemoveHandler)

  const animation = setInterval(() => {
    window.eel.get_frame()(({ frame, current }: FrameData) => {
      if (!frame) return
      console.log(current)
      const image = new Image()
      image.onload = () => {
        ctx.clearRect(0, 0, width, height)

        ctx.drawImage(image, 0, 0, width, height)

        // draw damage chart
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(0, height)
        result.damages.map(({ total }, index) => {
          ctx.lineTo(
            (width * index) / result.damages.length,
            height - ((height * total) / maxDamage) * 0.5
          )
        })
        ctx.moveTo(width, height)
        ctx.fill()

        const damageFrame = Math.floor(current / damage_dropout)
        const damages = result.damages[damageFrame].damages
        if (!damages) return
        damages.map(({ rect }) => {
          ctx.strokeStyle = 'blue'
          ctx.lineWidth = 4
          ctx.strokeRect(
            (rect[0] / frame_width) * width,
            (rect[1] / frame_height) * height,
            (rect[2] / frame_width) * width,
            (rect[3] / frame_height) * height
          )
        })

        const enemyFrame = Math.floor(current / enemy_dropout)
        const enemy = result.enemies[enemyFrame]
        if (enemy.type !== 'none') {
          const [x1, y1, x2, y2] = enemy.bbox
          ctx.strokeStyle = 'green'
          ctx.lineWidth = 4
          ctx.strokeRect(
            (x1 / frame_width) * width,
            (y1 / frame_height) * height,
            ((x2 - x1) / frame_width) * width,
            ((y2 - y1) / frame_height) * height
          )
          ctx.font = '40px serif'
          ctx.lineWidth = 1
          ctx.strokeText(
            enemy.type,
            (x1 / frame_width) * width,
            (y2 / frame_height) * height
          )
        }

        // play bar
        ctx.beginPath()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 10
        ctx.moveTo((current / frame_count) * width, 0)
        ctx.lineTo((current / frame_count) * width, height)
        ctx.stroke()
      }
      image.src = frame
    })
  }, 1000 / fps)

  return () => {
    clearInterval(animation)
    canvas.removeEventListener('mousemove', mousemoveHandler)
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

  return <canvas ref={canvasRef} width="1920" height="1080"></canvas>
}
