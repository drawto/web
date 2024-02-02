const CIRCLE_TRANSPARENT_SIZE_BREAKPOINT = 5
const CIRCLE_STROKE_WIDTH = 2
const CIRCLE_PADDING = 4

export function createCursorCircle ( size: number, color: string = 'black' ): Promise<Blob> {
  return new Promise(( resolve, reject ) => {
    // Create a canvas element
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    // Adjust canvas size to accommodate the circle or dot
    canvas.width = size + CIRCLE_PADDING // Add some padding for the stroke
    canvas.height = size + CIRCLE_PADDING

    if (context) {
      // Set styles for the circle or dot
      context.fillStyle = color
      context.strokeStyle = color
      context.lineWidth = size > CIRCLE_TRANSPARENT_SIZE_BREAKPOINT ? CIRCLE_STROKE_WIDTH : size

      // Draw circle or dot
      if (size > 5) {
        // Draw a transparent circle with a 2px stroke
        context.beginPath()
        context.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2)
        context.fillStyle = 'transparent'
        context.fill()
        context.stroke()
      } else {
        // Draw a rounded dot
        context.beginPath()
        context.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2)
        context.fill()
      }

      // Convert the canvas to a Blob
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Blob creation failed'))
        }
      })
    } else {
      reject(new Error('2D context not supported'))
    }
  })
}
