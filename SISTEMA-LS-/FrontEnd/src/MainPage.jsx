import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente principal del sistema Project UWU
 * Versión optimizada con navegación React Router funcional
 */
const MainPage = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);

  /**
   * Maneja la navegación directa a páginas de usuario
   */
  const handleUserNavigation = useCallback((userPage) => {
    console.log(`Navegando a página: ${userPage}`);
    
    try {
      if (userPage === 'vowels') {
        navigate('/user/vowels');
      } else if (userPage === 'numbers') {
        navigate('/user/numbers');
      } else {
        console.warn(`Página no reconocida: ${userPage}`);
      }
    } catch (error) {
      console.error('Error en navegación:', error);
    }
  }, [navigate]);

  /**
   * Maneja el proceso de inicio de sesión
   */
  const handleLogin = useCallback((userType) => {
    console.log(`Iniciando login para: ${userType}`);
    setSelectedUserType(userType);
    setShowLoginModal(true);
  }, []);

  /**
   * Procesa la autenticación del usuario
   */
  const processLogin = useCallback((credentials) => {
    console.log('Procesando autenticación:', credentials.userType);
    setShowLoginModal(false);
    
    try {
      // Navegar según el tipo de usuario
      if (credentials.userType === 'admin') {
        navigate('/admin/vowels');
      } else {
        navigate('/user/vowels');
      }
    } catch (error) {
      console.error('Error en navegación post-login:', error);
    }
  }, [navigate]);

  /**
   * Cierra el modal de login
   */
  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setSelectedUserType(null);
  }, []);

  return (
    <div className="main-page-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Header Principal */}
      <header style={{
        background: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        marginBottom: '2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo y título */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '180px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
              transition: 'transform 0.3s ease'
            }}>
              <span style={{ fontSize: '2rem' }}>👤</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#1e293b',
                margin: '0',
                lineHeight: '1.2'
              }}>PROJECT UWU</h1>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                margin: '0.25rem 0 0 0',
                fontWeight: '500'
              }}>SISTEMA DE SEÑAS IA</p>
            </div>
          </div>

          {/* Botones de navegación */}
          <nav style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            minWidth: '0',
            flex: '1',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => handleLogin('user')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#64748b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                minWidth: '140px',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.25)';
                e.target.style.background = '#475569';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = '#64748b';
              }}
            >
              🔓 INICIAR SESIÓN
            </button>
            
            <div style={{
              width: '1px',
              height: '40px',
              background: '#e2e8f0',
              margin: '0 0.5rem',
              display: 'none'
            }}></div>
            
            <button
              onClick={() => handleUserNavigation('vowels')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
                minWidth: '160px',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px 0 rgb(0 0 0 / 0.1)';
              }}
            >
              🅰️ VOCALES
            </button>
            
            <button
              onClick={() => handleUserNavigation('numbers')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
                minWidth: '160px',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px 0 rgb(0 0 0 / 0.1)';
              }}
            >
              🔢 NÚMEROS
            </button>

            <button
              onClick={() => handleLogin('admin')}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
              }}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Sección de llamada a la acción */}
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          marginBottom: '3rem',
          boxShadow: '0 8px 32px 0 rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(1px)',
            zIndex: 1
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Aprende Lenguaje de Señas con IA
            </h2>
            <p style={{
              fontSize: '1.25rem',
              opacity: 0.9,
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: '1.5'
            }}>
              Utiliza tecnología de reconocimiento de gestos avanzada para 
              practicar vocales y números de forma interactiva y personalizada
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => handleUserNavigation('vowels')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '1.2rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🅰️</span>
                Entrenar Vocales
              </button>
              
              <button
                onClick={() => handleUserNavigation('numbers')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '1.2rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🔢</span>
                Entrenar Números
              </button>
            </div>

            <p style={{
              fontSize: '0.875rem',
              opacity: 0.8,
              marginTop: '1.5rem',
              fontStyle: 'italic'
            }}>
              Acceso directo sin necesidad de registrarse
            </p>
          </div>
        </section>

        {/* Sección de características */}
        <section style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            🤖 Tecnología Avanzada de IA
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #bae6fd',
              transition: 'transform 0.2s ease'
            }}>
              <h4 style={{ 
                color: '#0369a1', 
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>Detección de Manos</h4>
              <p style={{ 
                color: '#0c4a6e', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                Reconocimiento en tiempo real de gestos de las manos usando 
                algoritmos de IA avanzada con precisión superior al 90%
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              transition: 'transform 0.2s ease'
            }}>
              <h4 style={{ 
                color: '#166534', 
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>Feedback Instantáneo</h4>
              <p style={{ 
                color: '#14532d', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                Corrección y guía inmediata para perfeccionar tus señas 
                con retroalimentación visual y progreso en tiempo real
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #fef7ff, #faf5ff)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #f3e8ff',
              transition: 'transform 0.2s ease'
            }}>
              <h4 style={{ 
                color: '#7c2d12', 
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>Aprendizaje Adaptativo</h4>
              <p style={{ 
                color: '#92400e', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                El sistema se adapta a tu ritmo de aprendizaje y 
                personaliza los ejercicios según tu progreso individual
              </p>
            </div>
          </div>
        </section>

        {/* Visión y Misión */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            transition: 'transform 0.2s ease'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>👁️</span> Visión
            </h2>
            <p style={{
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontSize: '0.95rem'
            }}>
              Convertirse en la plataforma líder en educación del 
              lenguaje de señas en Latinoamérica, reconocida por su impacto en 
              la eliminación de barreras comunicativas y la construcción de una 
              sociedad más inclusiva y equitativa para personas sordas.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            transition: 'transform 0.2s ease'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🎯</span> Misión
            </h2>
            <p style={{
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontSize: '0.95rem'
            }}>
              Proporcionar un espacio digital inclusivo que facilite la 
              comunicación entre personas sordas y oyentes, promoviendo el 
              aprendizaje del lenguaje de señas como herramienta 
              fundamental para la integración social y laboral.
            </p>
          </div>
        </div>

        {/* Objetivos */}
        <section style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🚀</span> Objetivos Principales
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #fef2f2, #fef7f7)',
              border: '1px solid #fecaca'
            }}>
              <span style={{
                background: '#ef4444',
                color: '#ffffff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '700',
                flexShrink: 0
              }}>1</span>
              <div>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                  Educativos
                </strong>
                <span style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Ofrecer recursos interactivos para aprender el lenguaje de señas 
                  de manera accesible con tecnología de vanguardia.
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f0f9ff, #f7fafc)',
              border: '1px solid #bae6fd'
            }}>
              <span style={{
                background: '#3b82f6',
                color: '#ffffff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '700',
                flexShrink: 0
              }}>2</span>
              <div>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                  Sociales
                </strong>
                <span style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Fomentar la inclusión y comunicación efectiva entre 
                  personas sordas y oyentes en diferentes entornos.
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f0fdf4, #f7fef7)',
              border: '1px solid #bbf7d0'
            }}>
              <span style={{
                background: '#10b981',
                color: '#ffffff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '700',
                flexShrink: 0
              }}>3</span>
              <div>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
                  Tecnológicos
                </strong>
                <span style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Implementar herramientas de IA innovadoras que faciliten 
                  el aprendizaje y la comunicación inclusiva.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid #e2e8f0',
        color: '#64748b',
        background: '#f8fafc',
        marginTop: '3rem'
      }}>
        <p style={{ margin: '0', fontSize: '0.875rem' }}>
          © 2024 Project UWU - SEBASTIÁN LB. Todos los derechos reservados.
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', opacity: 0.8 }}>
          Powered by React & IA Technology
        </p>
      </footer>

      {/* Modal de login */}
      {showLoginModal && (
        <LoginModal 
          userType={selectedUserType}
          onClose={closeLoginModal}
          onLogin={processLogin}
        />
      )}
    </div>
  );
};

/**
 * Modal de inicio de sesión optimizado
 */
const LoginModal = React.memo(({ userType, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }
    if (!credentials.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('Procesando login...', userType);
      
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      onLogin({ 
        ...credentials, 
        userType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({ general: 'Error al iniciar sesión' });
    } finally {
      setIsLoading(false);
    }
  }, [credentials, userType, onLogin]);

  const handleChange = useCallback((field) => (e) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Iniciar Sesión
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0
            }}>
              {userType === 'admin' ? 'Panel de Administración' : 'Acceso de Usuario'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              color: '#64748b',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.color = '#64748b';
            }}
          >
            ×
          </button>
        </div>

        {errors.general && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={handleChange('username')}
              required
              disabled={isLoading}
              placeholder="Ingresa tu usuario"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: `2px solid ${errors.username ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                background: isLoading ? '#f8fafc' : '#ffffff',
                cursor: isLoading ? 'not-allowed' : 'text',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.username) {
                  e.target.style.borderColor = '#3b82f6';
                }
              }}
              onBlur={(e) => {
                if (!errors.username) {
                  e.target.style.borderColor = '#e2e8f0';
                }
              }}
            />
            {errors.username && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={handleChange('password')}
              required
              disabled={isLoading}
              placeholder="Ingresa tu contraseña"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: `2px solid ${errors.password ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                background: isLoading ? '#f8fafc' : '#ffffff',
                cursor: isLoading ? 'not-allowed' : 'text',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = '#3b82f6';
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = '#e2e8f0';
                }
              }}
            />
            {errors.password && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#f3f4f6';
                }
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !credentials.username.trim() || !credentials.password.trim()}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: userType === 'admin' ? '#ef4444' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: (isLoading || !credentials.username.trim() || !credentials.password.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || !credentials.username.trim() || !credentials.password.trim()) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>
        </form>

        {/* Credenciales demo */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            margin: '0 0 0.5rem 0',
            fontWeight: '600'
          }}>
            Credenciales de prueba:
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#374151',
            margin: '0',
            fontFamily: 'monospace'
          }}>
            Usuario: {userType === 'admin' ? 'admin' : 'demo'} | Contraseña: {userType === 'admin' ? 'admin123' : 'demo123'}
          </p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
});

LoginModal.displayName = 'LoginModal';

export default MainPage;