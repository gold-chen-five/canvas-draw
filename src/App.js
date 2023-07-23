import { useDraw } from "./hooks/useDraw";
import { ChromePicker, HuePicker, AlphaPicker } from 'react-color'
import { useState } from "react";
import rgbHex from "rgb-hex";
function App() {
  const [color, setColor] = useState('#000')
  
  const { canvasRef, onMouseDown, clear, exportCanvasToImage} = useDraw(drawLine)

  function drawLine({prevPoint, currentPoint, ctx}){
    const { x: currX, y: currY } = currentPoint
    const lineColor = color
    const lineWidth = 7.5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()

  }
  
  return (
    <div className="App"
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: "4px"
      }}
    >
      <ChromePicker color={color} onChange={(c) => setColor("#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a))}/>
      <button onClick={exportCanvasToImage}>export image</button>
      <button type="button" onClick={clear} style={{ padding: '4px', borderRadius: '4px'}}>clear</button>
      <canvas 
        onMouseDown={onMouseDown}
        width={550} 
        height={550} 
        ref={canvasRef}
        style={{
          border: '2px solid black',
          borderRadius: '2px'
        }}
      />
    </div>
  );
}

export default App;
