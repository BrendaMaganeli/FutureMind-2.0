import React from "react";

function VisualizarProfissional() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-700 p-6 text-white flex flex-col items-center">
        <h1 className="text-sm font-light opacity-70 mb-6">tela de perfil</h1>
        <div className="w-40 h-24 bg-gray-200 rounded-lg opacity-80"></div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 bg-white p-8">
        {/* Caixa Especialização e Abordagem */}
        <div className="bg-blue-300 p-6 rounded-lg flex gap-4 mb-6">
          <div className="flex-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-blue-700 font-semibold">Especialização</h2>
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-blue-700 font-semibold">Abordagem</h2>
          </div>
        </div>

        {/* Caixa Sobre Mim */}
        <div className="bg-blue-300 p-6 rounded-lg">
          <h2 className="text-blue-700 font-semibold mb-2">Sobre mim</h2>
          <div className="bg-white p-4 rounded-lg shadow h-32"></div>
        </div>
      </main>
    </div>
  );
}

export default VisualizarProfissional;
