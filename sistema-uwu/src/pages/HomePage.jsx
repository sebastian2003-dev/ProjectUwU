import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  const buttons = [
    { text: 'ENTRENAR LETRAS', path: '/entrenar-letras' },
    { text: 'ENTRENAR NUMEROS', path: '/entrenar-numeros' },
    { text: '¡¡¡RECONOCE TUS LETRAS!!!', path: '/reconoce-letras' },
    { text: 'RECONOCE TUS NUMEROS', path: '/reconoce-numeros' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">HOMEPAGE</h1>
      </header>

      <div className="container mx-auto px-6 py-8 flex gap-8 max-w-7xl">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-lg font-bold mb-6">PROJECT<br/>UWU</h2>
            
            {/* Logo Placeholder */}
            <div className="relative w-40 h-40 mx-auto mb-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 rounded-full"></div>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-20 bg-purple-400 rounded-t-full"></div>
            </div>
            
            <p className="text-sm font-semibold mt-2 text-gray-700">AQUI VA UN LOGO</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {buttons.map((btn, index) => (
              <button
                key={index}
                onClick={() => navigate(btn.path)}
                className="bg-purple-200 hover:bg-purple-300 transition-colors rounded-lg p-6 flex items-center justify-center gap-3 text-purple-900 font-semibold text-base shadow-md hover:shadow-lg"
              >
                <Plus className="w-6 h-6" />
                {btn.text}
              </button>
            ))}
          </div>

          {/* Vision Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2 text-lg">
              <span className="text-xl">👀</span> Visión
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Convertirse en la plataforma líder en educación y difusión del lenguaje de señas en Latinoamérica, reconocida por su impacto en la eliminación de barreras comunicativas y la construcción de una sociedad más empática, inclusiva y equitativa.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2 text-lg">
              <span className="text-xl">⭐</span> Misión
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Brindar un espacio digital inclusivo y accesible que facilite la comunicación entre personas sordas y oyentes, promoviendo el aprendizaje y uso del lenguaje de señas como herramienta fundamental para la integración social, educativa y laboral.
            </p>
          </div>

          {/* Objectives Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-lg">
              <span className="text-xl">🎯</span> Objetivos
            </h3>
            <ol className="space-y-4 text-gray-700 text-sm">
              <li>
                <span className="font-semibold">1. Educativos:</span> Ofrecer cursos, tutoriales y recursos interactivos para aprender y practicar el lenguaje de señas de manera fácil y accesible.
              </li>
              <li>
                <span className="font-semibold">2. Sociales:</span> Fomentar la inclusión y la comunicación efectiva entre personas sordas y oyentes en diferentes entornos.
              </li>
              <li>
                <span className="font-semibold">3. Tecnológicos:</span> Implementar herramientas digitales innovadoras (videos, intérpretes virtuales, chats inclusivos) que faciliten el aprendizaje y la comunicación.
              </li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  )
}