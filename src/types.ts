export type CanvasItemState = {
  xLoc: number,
  yLoc: number,
}

export type CanvasWorkflowState = 'idle' | 'dragging'

export type CanvasItemJSONElement = {
  svg: string,
  color: string,
  xLoc: number,
  yLoc: number
}
