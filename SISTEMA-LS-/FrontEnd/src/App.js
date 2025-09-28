import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import UserPageVowels from './UserPageVowels';
import AdminPageVowels from './AdminPageVowels';
import './App.css';

// Componente temporal para la página de números (hasta que la implementes)
const UserPageNumbers = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <button 
        onClick={handleBackClick}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        ← Volver al Menú
      </button>
      
      <div style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          🔢 Aprendizaje de Números
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Próximamente: Sistema de reconocimiento de números en lenguaje de señas
        </p>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>🚧 En Desarrollo</h2>
          <p style={{ 
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Esta sección está siendo desarrollada para incluir:
          </p>
          <ul style={{
            textAlign: 'left',
            maxWidth: '400px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            <li>Reconocimiento de números del 0 al 9</li>
            <li>Ejercicios interactivos con IA</li>
            <li>Progreso personalizado</li>
            <li>Evaluación en tiempo real</li>
          </ul>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleBackClick}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🏠 Volver al Inicio
          </button>

          <button
            onClick={() => window.location.href = '/user/vowels'}
            style={{
              background: 'rgba(59, 130, 246, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(59, 130, 246, 0.6)',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.8)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🅰️ Practicar Vocales
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para página no encontrada
const NotFound = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        borderRadius: '20px',
        padding: '3rem 2rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#ef4444'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#1e293b'
        }}>
          Página no encontrada
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#64748b',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          La página que buscas no existe o ha sido movida.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🏠 Ir al Inicio
        </button>
      </div>
    </div>
  );
};

function App() {
  console.log('🚀 Aplicación Project UWU iniciando...');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          
          {/* Rutas de usuario */}
          <Route path="/user/vowels" element={<UserPageVowels />} />
          <Route path="/user/numbers" element={<UserPageNumbers />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin/vowels" element={<AdminPageVowels />} />
          <Route path="/admin/numbers" element={<UserPageNumbers />} />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;