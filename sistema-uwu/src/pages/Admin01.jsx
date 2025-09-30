import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle2, Plus } from 'lucide-react'

export default function Admin01() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [stream, setStream] = useState(null)
  const [capturedLetter, setCapturedLetter] = useState('')
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [handsInstance, setHandsInstance] = useState(null)
  const [currentTrainingLetter, setCurrentTrainingLetter] = useState('A')
  const [capturedFrames, setCapturedFrames] = useState(0)
  const animationFrameId = useRef(null)
  const lastLandmarks = useRef(null)

  // Estructura del localStorage:
  // {
  //   'A': [[x1,y1,z1], [x2,y2,z2], ...],
  //   'E': [[x1,y1,z1], [x2,y2,z2], ...],
  //   ...
  // }

  // Botones de entrenamiento
  const trainingButtons = [
    { label: 'ENTRENAR A', value: 'A' },
    { label: 'ENTRENAR E', value: 'E' },
    { label: 'ENTRENAR I', value: 'I' },
    { label: 'ENTRENAR O', value: 'O' },
    { label: 'ENTRENAR U', value: 'U' }
  ]

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const loadTrainingData = () => {
      const stored = localStorage.getItem('handTrainingData')
      if (stored) {
        const data = JSON.parse(stored)
        console.log('Datos de entrenamiento cargados:', data)
        updateProgress()
      } else {
        // Inicializar estructura vacía
        const initialData = {
          'A': [],
          'E': [],
          'I': [],
          'O': [],
          'U': []
        }
        localStorage.setItem('handTrainingData', JSON.stringify(initialData))
        console.log('Estructura de datos inicializada')
      }
    }
    loadTrainingData()
  }, [])

  // Actualizar progreso basado en datos guardados
  const updateProgress = () => {
    const stored = localStorage.getItem('handTrainingData')
    if (stored) {
      const data = JSON.parse(stored)
      const totalFrames = Object.values(data).reduce((acc, arr) => acc + arr.length, 0)
      const targetFrames = 500 // Meta: 500 frames totales (100 por letra)
      const progress = Math.min((totalFrames / targetFrames) * 100, 100)
      setTrainingProgress(Math.round(progress))
      
      // Contar frames de la letra actual
      if (currentTrainingLetter && data[currentTrainingLetter]) {
        setCapturedFrames(data[currentTrainingLetter].length)
      }
    }
  }

  // Guardar landmarks en localStorage
  const saveLandmarksToStorage = (landmarks, letter) => {
    try {
      // Obtener datos actuales
      const stored = localStorage.getItem('handTrainingData')
      const data = stored ? JSON.parse(stored) : {
        'A': [], 'E': [], 'I': [], 'O': [], 'U': []
      }

      // Convertir landmarks a array bidimensional simple
      // Formato: [[x1, y1, z1], [x2, y2, z2], ..., [x21, y21, z21]]
      const landmarkArray = landmarks.map(point => [
        parseFloat(point.x.toFixed(6)),
        parseFloat(point.y.toFixed(6)),
        parseFloat(point.z.toFixed(6))
      ])

      // Agregar a la letra correspondiente
      if (!data[letter]) {
        data[letter] = []
      }
      data[letter].push(landmarkArray)

      // Guardar en localStorage
      localStorage.setItem('handTrainingData', JSON.stringify(data))
      
      console.log(`Frame guardado para letra ${letter}. Total: ${data[letter].length} frames`)
      
      // Actualizar UI
      updateProgress()
      
      return true
    } catch (error) {
      console.error('Error al guardar en localStorage:', error)
      if (error.name === 'QuotaExceededError') {
        alert('LocalStorage lleno. Por favor exporta los datos o borra datos antiguos.')
      }
      return false
    }
  }

  // Obtener estadísticas de entrenamiento
  const getTrainingStats = () => {
    const stored = localStorage.getItem('handTrainingData')
    if (stored) {
      const data = JSON.parse(stored)
      return {
        A: data.A?.length || 0,
        E: data.E?.length || 0,
        I: data.I?.length || 0,
        O: data.O?.length || 0,
        U: data.U?.length || 0,
        total: Object.values(data).reduce((acc, arr) => acc + arr.length, 0)
      }
    }
    return { A: 0, E: 0, I: 0, O: 0, U: 0, total: 0 }
  }

  // Limpiar datos de una letra específica
  const clearLetterData = (letter) => {
    const stored = localStorage.getItem('handTrainingData')
    if (stored) {
      const data = JSON.parse(stored)
      data[letter] = []
      localStorage.setItem('handTrainingData', JSON.stringify(data))
      updateProgress()
      console.log(`Datos de la letra ${letter} eliminados`)
    }
  }

  // Limpiar todos los datos
  const clearAllData = () => {
    const confirmClear = window.confirm('¿Estás seguro de que quieres borrar TODOS los datos de entrenamiento?')
    if (confirmClear) {
      const initialData = {
        'A': [], 'E': [], 'I': [], 'O': [], 'U': []
      }
      localStorage.setItem('handTrainingData', JSON.stringify(initialData))
      setTrainingProgress(0)
      setCapturedFrames(0)
      console.log('Todos los datos eliminados')
    }
  }

  // Exportar datos como JSON
  const exportData = () => {
    const stored = localStorage.getItem('handTrainingData')
    if (stored) {
      const blob = new Blob([stored], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hand-training-data-${new Date().toISOString()}.json`
      a.click()
      URL.revokeObjectURL(url)
      console.log('Datos exportados')
    }
  }

  // Dibujar landmarks en el canvas
  const drawLandmarks = (landmarks) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Guardar referencia de los últimos landmarks detectados
    lastLandmarks.current = landmarks

    // Conexiones de la mano
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Pulgar
      [0, 5], [5, 6], [6, 7], [7, 8], // Índice
      [0, 9], [9, 10], [10, 11], [11, 12], // Medio
      [0, 13], [13, 14], [14, 15], [15, 16], // Anular
      [0, 17], [17, 18], [18, 19], [19, 20], // Meñique
      [5, 9], [9, 13], [13, 17] // Palma
    ]

    // Dibujar conexiones
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 3
    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start]
      const endPoint = landmarks[end]
      
      ctx.beginPath()
      ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
      ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
      ctx.stroke()
    })

    // Dibujar puntos
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * canvas.width
      const y = landmark.y * canvas.height

      // Punto principal
      ctx.fillStyle = index === 0 ? '#FF0000' : '#00FF00'
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Borde blanco
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }

  // Procesar video frame por frame
  const detectHands = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !handsInstance) return
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(detectHands)
      return
    }

    try {
      await handsInstance.send({ image: video })
      animationFrameId.current = requestAnimationFrame(detectHands)
    } catch (error) {
      console.error('Error en detección:', error)
      animationFrameId.current = requestAnimationFrame(detectHands)
    }
  }

  // Callback cuando MediaPipe detecta manos
  const onResults = (results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      drawLandmarks(results.multiHandLandmarks[0])
    } else {
      // Limpiar canvas si no hay manos
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      lastLandmarks.current = null
    }
  }

  // Cargar MediaPipe Hands
  useEffect(() => {
    let mounted = true

    const loadMediaPipe = () => {
      if (window.Hands && mounted) {
        const hands = new window.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          }
        })

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        hands.onResults(onResults)
        
        if (mounted) {
          setHandsInstance(hands)
          console.log('MediaPipe Hands cargado correctamente')
        }
      } else if (mounted) {
        setTimeout(loadMediaPipe, 100)
      }
    }

    loadMediaPipe()

    return () => {
      mounted = false
    }
  }, [])

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraOn(true)

        // Esperar a que el video esté listo
        videoRef.current.onloadedmetadata = () => {
          if (handsInstance) {
            detectHands()
          }
        }
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error)
      alert('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }

  // Detener cámara
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraOn(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }

    // Limpiar canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // Capturar frame para entrenamiento
  const captureFrame = () => {
    if (!currentTrainingLetter) {
      alert('Por favor selecciona una letra para entrenar')
      return
    }

    if (!lastLandmarks.current) {
      alert('No se detecta ninguna mano. Por favor muestra tu mano a la cámara.')
      return
    }

    if (!isCameraOn) {
      alert('Por favor inicia la cámara primero')
      return
    }

    // Guardar landmarks en localStorage
    const success = saveLandmarksToStorage(lastLandmarks.current, currentTrainingLetter)
    
    if (success) {
      const stats = getTrainingStats()
      setCapturedLetter(`LETRA ${currentTrainingLetter} CAPTURADA CON ÉXITO - Total: ${stats[currentTrainingLetter]} frames`)
      
      // Efecto visual de captura
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        setTimeout(() => {
          drawLandmarks(lastLandmarks.current)
        }, 100)
      }
    }
  }

  // Entrenar letra específica
  const trainLetter = (letter) => {
    setCurrentTrainingLetter(letter)
    const stats = getTrainingStats()
    setCapturedLetter(`Preparado para entrenar: ${letter} - Frames actuales: ${stats[letter]}`)
    setCapturedFrames(stats[letter])
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Cargar scripts de MediaPipe
  useEffect(() => {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
    ]

    const loadedScripts = []

    scripts.forEach(src => {
      const script = document.createElement('script')
      script.src = src
      script.crossOrigin = 'anonymous'
      script.async = false
      document.body.appendChild(script)
      loadedScripts.push(script)
    })

    return () => {
      loadedScripts.forEach(script => {
        if (script.parentNode) {
          document.body.removeChild(script)
        }
      })
    }
  }, [])

  // Mostrar estadísticas
  const stats = getTrainingStats()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-700 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">ADMINPAGE VOWELS</h1>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-xs font-semibold"
          >
            Exportar Datos
          </button>
          <button
            onClick={clearAllData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-xs font-semibold"
          >
            Borrar Todo
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Izquierdo */}
          <aside className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 text-center mb-4">
              <div className="w-20 h-20 mx-auto mb-2 bg-purple-200 rounded-full flex items-center justify-center">
                <UserCircle2 className="w-12 h-12 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">LOGO</p>
            </div>

            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xs font-bold mb-2 text-gray-700">Estadísticas</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>A:</span>
                  <span className="font-semibold">{stats.A}</span>
                </div>
                <div className="flex justify-between">
                  <span>E:</span>
                  <span className="font-semibold">{stats.E}</span>
                </div>
                <div className="flex justify-between">
                  <span>I:</span>
                  <span className="font-semibold">{stats.I}</span>
                </div>
                <div className="flex justify-between">
                  <span>O:</span>
                  <span className="font-semibold">{stats.O}</span>
                </div>
                <div className="flex justify-between">
                  <span>U:</span>
                  <span className="font-semibold">{stats.U}</span>
                </div>
                <div className="border-t pt-1 mt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{stats.total}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="col-span-7">
            {/* Botones superiores */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full py-3 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                MENU
              </button>
              <button
                onClick={() => navigate('/entrenar-letras')}
                className="flex-1 bg-purple-200 hover:bg-purple-300 text-purple-900 rounded-full py-3 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                ENTRENAR LETRAS
              </button>
              <button
                onClick={() => navigate('/entrenar-numeros')}
                className="flex-1 bg-purple-200 hover:bg-purple-300 text-purple-900 rounded-full py-3 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                ENTRENAR NUMEROS
              </button>
            </div>

            {/* Área de captura */}
            <div className="bg-purple-200 rounded-lg p-4 mb-4">
              <div className="bg-white rounded-lg p-2 mb-2 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {capturedLetter || `Letra actual: ${currentTrainingLetter} - Frames: ${capturedFrames}`}
                </p>
              </div>

              {/* Video/Canvas */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '360px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ display: isCameraOn ? 'block' : 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ display: isCameraOn ? 'block' : 'none' }}
                />
                
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p className="text-lg">Cámara apagada</p>
                  </div>
                )}
              </div>

              {/* Controles de cámara */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={startCamera}
                  disabled={isCameraOn}
                  className="flex-1 bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-800 disabled:text-gray-500 rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  INICIAR CAMARA
                </button>
                <button
                  onClick={stopCamera}
                  disabled={!isCameraOn}
                  className="flex-1 bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-800 disabled:text-gray-500 rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  DETENER CAMARA
                </button>
              </div>
            </div>
          </main>

          {/* Sidebar Derecho */}
          <aside className="col-span-3">
            {/* Botones de entrenamiento */}
            <div className="space-y-3 mb-6">
              {trainingButtons.map((btn, index) => (
                <button
                  key={index}
                  onClick={() => trainLetter(btn.value)}
                  className={`w-full rounded-lg py-3 px-4 font-semibold text-sm flex items-center justify-between transition-colors ${
                    currentTrainingLetter === btn.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-200 hover:bg-purple-300 text-purple-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {btn.label}
                  </div>
                  <span className="text-xs">({stats[btn.value]})</span>
                </button>
              ))}
            </div>

            {/* Indicador de progreso */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e9d5ff"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#9333ea"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - trainingProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">{trainingProgress}%</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                PROGRESO DE ENTRENAR EL DATASET
              </p>
              <button 
                onClick={captureFrame}
                disabled={!isCameraOn || !currentTrainingLetter}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-lg py-2 px-4 text-sm font-semibold transition-colors"
              >
                Capturar Frame
              </button>
              <p className="text-xs text-gray-500 mt-2">Meta: 500 frames totales</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}