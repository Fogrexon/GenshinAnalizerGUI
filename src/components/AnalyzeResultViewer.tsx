import { useEffect, useRef } from 'react'

const enemy2Color: Record<string, string> = {
  cyroreg: '#66ffff',
  andrius: '#5599ff',
  rhodeia: '#ddddff',
  geovishap: '#aaff88',
  pyroreg: '#ff8888',
  mechanicalarray: '#994444',
  maguukenki: '#22ff99',
  thundermanifestation: '#cc55ff',
  wolfloard: '#dddd33'
}

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

  // seeking
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

  // drawing
  const maxDamage = result.damages.reduce(
    (prev, value) => Math.max(prev, value.total),
    0
  )
  const damageRates = result.damages.map(({ total }) => total / maxDamage)
  for (let i = 0; i < 50; i++) {
    for (let j = 1; j < damageRates.length - 1; j++) {
      const prev = damageRates[j - 1]
      let curr = damageRates[j]
      const next = damageRates[j + 1]
      if (prev > curr) {
        if (next > curr) {
          curr = ((prev + next) / 2) * 0.9
        } else {
          curr = prev * 0.9
        }
      } else if (next > curr) {
        curr = next * 0.9
      }
      damageRates[j] = curr
    }
  }

  let frameBlocking = false
  const animation = setInterval(() => {
    if (frameBlocking) return
    frameBlocking = true
    window.eel.get_frame()(({ frame, current }: FrameData) => {
      if (!frame) return
      const image = new Image()
      image.onload = () => {
        ctx.clearRect(0, 0, width, height)

        ctx.drawImage(image, 0, 0, width, height)

        // draw damage chart
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(0, height)
        damageRates.map((rate, index) => {
          ctx.lineTo(
            (width * index) / damageRates.length,
            height - height * rate * 0.5
          )
        })
        ctx.lineTo(width, height)
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
          ctx.strokeStyle = enemy2Color[enemy.type] ?? 'green'
          ctx.lineWidth = 4
          ctx.strokeRect(
            (x1 / frame_width) * width,
            (y1 / frame_height) * height,
            ((x2 - x1) / frame_width) * width,
            ((y2 - y1) / frame_height) * height
          )
          ctx.font = '40px serif'
          ctx.lineWidth = 1
          ctx.fillStyle = enemy2Color[enemy.type] ?? 'green'
          ctx.fillText(
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
      frameBlocking = false
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
