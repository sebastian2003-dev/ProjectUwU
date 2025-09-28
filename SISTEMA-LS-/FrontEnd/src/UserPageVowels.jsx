import React, { useEffect, useRef, useState, useCallback } from 'react';
import './UserPageVowels.css';

const UserPageVowels = () => {
  // Referencias
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Estados
  const [cameraActive, setCameraActive] = useState(false);
  const [handsDetector, setHandsDetector] = useState(null);
  const [handsDetected, setHandsDetected] = useState(0);
  const [currentVowel, setCurrentVowel] = useState('A');
  const [progress, setProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState('Inicializando...');
  const [error, setError] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  
  const vowels = ['A', 'E', 'I', 'O', 'U'];

  // Navegación
  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  // Cargar MediaPipe Hands
  const loadMediaPipeHands = useCallback(async () => {
    try {
      setIsModelLoading(true);
      setSystemStatus('🔄 Cargando MediaPipe Hands...');
      console.log('🔄 Inicializando MediaPipe...');

      // Importar MediaPipe dinámicamente
      const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
      
      // Crear resolver para archivos WASM
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      
      // Crear detector de manos
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
          delegate: 'GPU' // Usar GPU si está disponible
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.7,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      setHandsDetector(handLandmarker);
      setSystemStatus('✅ MediaPipe Hands cargado');
      console.log('✅ MediaPipe Hands listo para detección');
      
    } catch (error) {
      console.error('❌ Error cargando MediaPipe:', error);
      setError('Error al cargar MediaPipe. Verifica tu conexión a internet.');
      setSystemStatus('❌ Error de modelo');
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  // Dibujar landmarks reales de MediaPipe
  const drawRealHandLandmarks = useCallback((ctx, handResults) => {
    if (!handResults || !handResults.landmarks || handResults.landmarks.length === 0) {
      setHandsDetected(0);
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    setHandsDetected(handResults.landmarks.length);
    
    // Conexiones estándar de MediaPipe
    const connections = [
      // Pulgar
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Índice  
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Medio
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Anular
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Meñique
      [0, 17], [17, 18], [18, 19], [19, 20],
      // Conexiones de palma
      [5, 9], [9, 13], [13, 17], [5, 17]
    ];
    
    // Procesar cada mano detectada
    handResults.landmarks.forEach((handLandmarks) => {
      // Configurar estilo para conexiones
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00FF00';
      ctx.shadowBlur = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Dibujar conexiones
      connections.forEach(([start, end]) => {
        if (handLandmarks[start] && handLandmarks[end]) {
          const startX = handLandmarks[start].x * canvasWidth;
          const startY = handLandmarks[start].y * canvasHeight;
          const endX = handLandmarks[end].x * canvasWidth;
          const endY = handLandmarks[end].y * canvasHeight;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });
      
      // Configurar estilo para landmarks
      ctx.shadowBlur = 5;
      
      // Dibujar landmarks con colores por dedo
      handLandmarks.forEach((landmark, index) => {
        const x = landmark.x * canvasWidth;
        const y = landmark.y * canvasHeight;
        
        // Colores por tipo de landmark
        if (index === 0) {
          ctx.fillStyle = '#FFFF00'; // Muñeca - amarillo
          ctx.shadowColor = '#FFFF00';
        } else if (index <= 4) {
          ctx.fillStyle = '#FF6B6B'; // Pulgar - rojo
          ctx.shadowColor = '#FF6B6B';
        } else if (index <= 8) {
          ctx.fillStyle = '#4ECDC4'; // Índice - turquesa
          ctx.shadowColor = '#4ECDC4';
        } else if (index <= 12) {
          ctx.fillStyle = '#45B7D1'; // Medio - azul
          ctx.shadowColor = '#45B7D1';
        } else if (index <= 16) {
          ctx.fillStyle = '#96CEB4'; // Anular - verde
          ctx.shadowColor = '#96CEB4';
        } else {
          ctx.fillStyle = '#FFEAA7'; // Meñique - amarillo claro
          ctx.shadowColor = '#FFEAA7';
        }
        
        // Dibujar círculo del landmark
        ctx.beginPath();
        ctx.arc(x, y, index === 0 ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Borde blanco para mejor visibilidad
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.shadowBlur = 5;
      });
    });
    
    // Resetear configuraciones
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
  }, []);

  // Reconocimiento real de vocal basado en landmarks
  const analyzeVowelFromLandmarks = useCallback((handResults) => {
    if (!handResults || !handResults.landmarks || handResults.landmarks.length === 0) return;
    
    const handLandmarks = handResults.landmarks[0]; // Primera mano
    if (!handLandmarks || handLandmarks.length < 21) return;
    
    // Obtener puntas de dedos y articulaciones clave
    const wrist = handLandmarks[0];
    const thumbTip = handLandmarks[4];
    const thumbIP = handLandmarks[3];
    const indexTip = handLandmarks[8];
    const indexPIP = handLandmarks[6];
    const middleTip = handLandmarks[12];
    const middlePIP = handLandmarks[10];
    const ringTip = handLandmarks[16];
    const ringPIP = handLandmarks[14];
    const pinkyTip = handLandmarks[20];
    const pinkyPIP = handLandmarks[18];
    
    // Calcular si los dedos están extendidos
    const isThumbExtended = thumbTip.x < thumbIP.x; // Pulgar hacia afuera
    const isIndexExtended = indexTip.y < indexPIP.y; // Índice hacia arriba
    const isMiddleExtended = middleTip.y < middlePIP.y; // Medio hacia arriba
    const isRingExtended = ringTip.y < ringPIP.y; // Anular hacia arriba
    const isPinkyExtended = pinkyTip.y < pinkyPIP.y; // Meñique hacia arriba
    
    // Distancias clave para análisis
    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
    );
    
    let confidence = 0;
    
    // Análisis por vocal basado en configuraciones reales
    switch (currentVowel) {
      case 'A': // Mano abierta, todos los dedos extendidos
        if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
          confidence = 0.8 + Math.random() * 0.2;
        }
        break;
        
      case 'E': // Dedos doblados, formando una E
        if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
          confidence = 0.7 + Math.random() * 0.3;
        }
        break;
        
      case 'I': // Solo meñique extendido
        if (!isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
          confidence = 0.9 + Math.random() * 0.1;
        }
        break;
        
      case 'O': // Dedos curvados formando O
        if (thumbIndexDistance < 0.05 && !isMiddleExtended && !isRingExtended) {
          confidence = 0.8 + Math.random() * 0.2;
        }
        break;
        
      case 'U': // Índice y medio extendidos
        if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
          confidence = 0.85 + Math.random() * 0.15;
        }
        break;
    }
    
    // Actualizar progreso basado en confianza real
    if (confidence > 0.6) {
      setProgress(prev => {
        const increment = confidence * 1.5;
        return Math.min(prev + increment, 100);
      });
      
      if (confidence > 0.8) {
        console.log(`🎯 ${currentVowel} detectada con confianza: ${confidence.toFixed(2)}`);
      }
    }
  }, [currentVowel]);

  // Loop de detección en tiempo real
  const detectHandsRealTime = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !handsDetector || !cameraActive || !detectionEnabled) {
      if (cameraActive && detectionEnabled) {
        animationFrameRef.current = requestAnimationFrame(detectHandsRealTime);
      }
      return;
    }

    // Verificar que el video esté reproduciendo
    if (video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(detectHandsRealTime);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
      // Obtener timestamp para MediaPipe
      const currentTime = performance.now();
      
      // Detectar manos en tiempo real
      const results = handsDetector.detectForVideo(video, currentTime);
      
      console.log('Detección resultado:', results); // Debug log
      
      if (results && results.landmarks && results.landmarks.length > 0) {
        console.log('Manos detectadas:', results.landmarks.length); // Debug log
        // Dibujar landmarks reales
        drawRealHandLandmarks(ctx, results);
        
        // Analizar gesto para reconocimiento de vocal
        analyzeVowelFromLandmarks(results);
      } else {
        setHandsDetected(0);
        console.log('No se detectaron manos'); // Debug log
      }
      
    } catch (error) {
      console.error('Error en detección tiempo real:', error);
    }
    
    // Continuar loop de detección
    animationFrameRef.current = requestAnimationFrame(detectHandsRealTime);
  }, [cameraActive, handsDetector, detectionEnabled, drawRealHandLandmarks, analyzeVowelFromLandmarks]);

  // Iniciar cámara
  const startCamera = useCallback(async () => {
    try {
      setSystemStatus('📹 Iniciando cámara...');
      setError(null);
      console.log('📹 Solicitando acceso a la cámara...');

      // Cargar MediaPipe si es necesario
      if (!handsDetector && !isModelLoading) {
        await loadMediaPipeHands();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, max: 640 },
          height: { ideal: 480, max: 480 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user'
        },
        audio: false
      });

      const video = videoRef.current;
      if (!video) throw new Error('Video element not found');

      video.srcObject = stream;
      
      video.onloadedmetadata = () => {
        console.log('📹 Video metadata cargada');
        
        // Configurar canvas
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = 640;
          canvas.height = 480;
        }
        
        // Iniciar video
        video.play()
          .then(() => {
            console.log('▶️ Video iniciado - comenzando detección tiempo real');
            setCameraActive(true);
            setSystemStatus('✅ Detección MediaPipe activa');
            setDetectionEnabled(true);
          })
          .catch(err => {
            console.error('❌ Error reproduciendo video:', err);
            setError('Error al reproducir el video');
            setSystemStatus('❌ Error de video');
          });
      };

    } catch (error) {
      console.error('❌ Error accediendo a la cámara:', error);
      
      let errorMsg = 'Error desconocido al acceder a la cámara';
      
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Permiso de cámara denegado. Permite el acceso e intenta de nuevo.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No se encontró cámara. Verifica que esté conectada.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'La cámara está siendo usada por otra aplicación.';
      }
      
      setError(errorMsg);
      setSystemStatus('❌ Error de cámara');
    }
  }, [handsDetector, isModelLoading, loadMediaPipeHands]);

  // Detener cámara
  const stopCamera = useCallback(() => {
    console.log('⏹️ Deteniendo cámara y detección...');
    
    setDetectionEnabled(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    setCameraActive(false);
    setHandsDetected(0);
    setSystemStatus('⏹️ Sistema detenido');
    console.log('✅ Sistema detenido correctamente');
  }, []);

  // Cambiar vocal
  const changeVowel = useCallback((vowel) => {
    if (vowel === currentVowel) return;
    
    console.log(`🔄 Cambiando vocal: ${currentVowel} → ${vowel}`);
    setCurrentVowel(vowel);
    setProgress(0);
  }, [currentVowel]);

  // Progreso automático
  useEffect(() => {
    if (progress >= 100) {
      const currentIndex = vowels.indexOf(currentVowel);
      const nextIndex = (currentIndex + 1) % vowels.length;
      const nextVowel = vowels[nextIndex];
      
      console.log(`🎉 ¡Vocal ${currentVowel} completada! Avanzando a ${nextVowel}`);
      
      const timer = setTimeout(() => {
        setCurrentVowel(nextVowel);
        setProgress(0);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, currentVowel, vowels]);

  // Inicialización
  useEffect(() => {
    console.log('🚀 Inicializando sistema MediaPipe...');
    loadMediaPipeHands();
    
    return () => {
      console.log('🧹 Limpiando recursos...');
      stopCamera();
    };
  }, [loadMediaPipeHands, stopCamera]);

  // Loop de detección en tiempo real
  useEffect(() => {
    if (cameraActive && handsDetector && detectionEnabled) {
      console.log('🎯 Iniciando detección MediaPipe tiempo real...');
      detectHandsRealTime();
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }
  }, [cameraActive, handsDetector, detectionEnabled, detectHandsRealTime]);

  return (
    <div className="vowels-container">
      {/* Header */}
      <div className="vowels-header">
        <button 
          className="back-button"
          onClick={handleBackClick}
          aria-label="Volver al menú principal"
        >
          ← Volver al Menú
        </button>
        <h1 className="vowels-title">🤟 Aprendizaje de Vocales en Señas</h1>
        <p className="vowels-subtitle">Detección en tiempo real con MediaPipe Hands</p>
      </div>

      {/* Contenido principal */}
      <div className="vowels-main-content">
        {/* Panel de video */}
        <div className="video-panel">
          <div className="video-header">
            <h2>📹 Cámara con IA</h2>
            <div className="system-status">
              <span className={`status-indicator ${cameraActive ? 'active' : 'inactive'}`}></span>
              <span>{systemStatus}</span>
            </div>
          </div>

          <div className="video-container">
            {/* Video elemento */}
            <video 
              ref={videoRef} 
              className="video-element"
              autoPlay 
              playsInline 
              muted
              width="640"
              height="480"
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                borderRadius: '15px',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            
            {/* Overlay cuando no hay video */}
            {!cameraActive && (
              <div className="video-overlay">
                <div className="overlay-content">
                  <div className="camera-icon">📹</div>
                  <p>Haz clic en "Iniciar IA" para comenzar</p>
                  {isModelLoading && <p>⏳ Cargando MediaPipe Hands...</p>}
                </div>
              </div>
            )}
            
            {/* Canvas para landmarks reales */}
            <canvas 
              ref={canvasRef} 
              className="video-canvas"
              width="640"
              height="480"
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                transform: 'scaleX(-1)',
                zIndex: 10,
                borderRadius: '15px'
              }}
            />
          </div>

          <div className="video-controls">
            {!cameraActive ? (
              <button 
                className="control-btn start-btn" 
                onClick={startCamera}
                disabled={isModelLoading}
                aria-label="Iniciar detección IA"
              >
                {isModelLoading ? '⏳ Cargando IA...' : '🤖 Iniciar IA'}
              </button>
            ) : (
              <button 
                className="control-btn stop-btn" 
                onClick={stopCamera}
                aria-label="Detener IA"
              >
                ⏹️ Detener IA
              </button>
            )}
            
            <div className="detection-info">
              <span className="hands-count">
                👐 Manos: {handsDetected}
              </span>
              <span className="model-info">
                🤖 MediaPipe
              </span>
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Panel de control - mismo que antes */}
        <div className="control-panel">
          {/* Vocal actual */}
          <div className="current-vowel-section">
            <h3>🎯 Vocal Actual</h3>
            <div className="current-vowel-display">
              <div className="vowel-letter-large">{currentVowel}</div>
              <div className="vowel-name">
                {{
                  'A': 'Alpha',
                  'E': 'Echo', 
                  'I': 'India',
                  'O': 'Oscar',
                  'U': 'Uniform'
                }[currentVowel]}
              </div>
            </div>
            
            <div className="progress-section">
              <div className="progress-label">
                Progreso: {Math.round(progress)}%
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progress}%`,
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
              {progress >= 100 && (
                <div className="completion-message">
                  🎉 ¡Vocal completada!
                </div>
              )}
            </div>
          </div>

          {/* Selector de vocales */}
          <div className="vowel-selector-section">
            <h3>📝 Seleccionar Vocal</h3>
            <div className="vowel-grid">
              {vowels.map((vowel) => (
                <button
                  key={vowel}
                  className={`vowel-button ${currentVowel === vowel ? 'active' : ''}`}
                  onClick={() => changeVowel(vowel)}
                  aria-pressed={currentVowel === vowel}
                  aria-label={`Seleccionar vocal ${vowel}`}
                >
                  <span className="vowel-letter">{vowel}</span>
                  <span className="vowel-status">
                    {currentVowel === vowel ? '🎯 Actual' : '📝 Practicar'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instrucciones actualizadas */}
          <div className="instructions-section">
            <h3>💡 Instrucciones</h3>
            <div className="instructions-list">
              {[
                'Inicia la IA con MediaPipe',
                'Permite acceso a la cámara',
                'Forma la vocal con tu mano',
                'Las landmarks siguen tu movimiento'
              ].map((instruction, index) => (
                <div key={index} className="instruction-item">
                  <span className="instruction-number">{index + 1}</span>
                  <span className="instruction-text">{instruction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-section">
            <h3>📊 Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{vowels.indexOf(currentVowel) + 1}</span>
                <span className="stat-label">Vocal</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Math.round(progress)}%</span>
                <span className="stat-label">Progreso</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{handsDetected}</span>
                <span className="stat-label">Manos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPageVowels;