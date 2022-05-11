interface FrameInfo {
  path: string
  fps: number
  frame_count: number
  frame_width: number
  frame_height: number
  frame_index: number
}

interface AnalyzeResult {
  fps: number
  frame_count: number
  frame_width: number
  frame_height: number
  damage_dropout: number
  enemy_dropout: number
  damages: {
    total: number
    damages: {
      number: number
      rect: [x: number, y: number, w: number, h: number]
    }[]
  }[]
  enemies: {
    bbox: [x1: number, y1: number, x2: number, y2: number]
    type: string
    score: number
  }[]
}
