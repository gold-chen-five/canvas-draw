import {useEffect, useRef, useState} from 'react'

export function useDraw(onDraw) {
    const [mouseDown, setMouseDown] = useState(false)
    const [clearOn, setClearOn] = useState(false)
    const canvasRef = useRef(null)
    const prevPoint = useRef(null)

    const onMouseDown = () => setMouseDown(true)

    const clear = () => {
        const canvas = canvasRef.current
        if(!canvas)  return

        const ctx = canvas.getContext('2d')
        if(!ctx)  return

        ctx.clearRect(0,0,canvas.width, canvas.height)
        setClearOn(true)
    }

    const drawImageOnCanvas = () => {
        const context = canvasRef.current.getContext('2d')
        const image = new Image()
        image.src = '/p1.jpeg'
        image.onload = () => {
            context.drawImage(image, 0, 0, 500, 500)
            setClearOn(false)
        }
    }

    const exportCanvasToImage = () => {
        const canvas = canvasRef.current
        const exportImage = canvas.toDataURL('image/png')
        console.log(exportImage)
        handlePost(exportImage)
        
    }

    const handlePost = async (canvasImg) => {
        const formData = new FormData()
        formData.append('picture', canvasImg)
        const response = await fetch(`http://localhost:3001/posts`,{
            method: 'POST',
            body: formData
        })
    
        const posts = await response.json()
        console.log(posts)
        
    }

    useEffect(() => {
        if(clearOn){
            drawImageOnCanvas()
        }
    },[clear])

    useEffect(() => {
        drawImageOnCanvas()
    },[])

    useEffect(() => {

        const handler = (e) => {
            if(!mouseDown)  return

            const currentPoint = computePointerCanvas(e)
            
            const ctx = canvasRef.current.getContext('2d')
            if(!ctx || !currentPoint) return

            onDraw({ctx, currentPoint, prevPoint: prevPoint.current })
            prevPoint.current = currentPoint


        }

        const computePointerCanvas = (e) => {
            const canvas = canvasRef.current
            if(!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return {x,y}
        }

        const mouseUpHandler = () => {
            setMouseDown(false)
            prevPoint.current = null
        }

        canvasRef.current.addEventListener('mousemove', handler)
        window.addEventListener('mouseup', mouseUpHandler)

        return () => {
            canvasRef.current.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    },[onDraw])

    return { canvasRef, onMouseDown, clear,  exportCanvasToImage }
}

