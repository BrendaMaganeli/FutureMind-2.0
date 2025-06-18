import { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import "./CSS/DiarioEmocional.css";
import voltar from "../assets/seta-principal.svg";
import { useNavigate } from "react-router-dom";

function NotesApp({ userId, isProfessional }) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("checklist");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Buscar pastas ao carregar o componente
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const url = `/pastas?${isProfessional ? 'id_profissional' : 'id_paciente'}=${userId}`;
        const response = await fetch(url);
        const data = await response.json();
        setFolders(data);
        if (data.length > 0) {
          setSelectedFolder(data[0]);
          fetchNotes(data[0].id_pasta);
        }
      } catch (error) {
        console.error("Erro ao buscar pastas:", error);
      } finally {
        setLoading(false);
      }
    };
=======
function NotesApp() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState(initialData);
  const [selectedFolder, setSelectedFolder] = useState(
    folders.length > 0 ? folders[0] : null
  );
  const [selectedNote, setSelectedNote] = useState(
    folders.length > 0 && folders[0].notes.length > 0
      ? folders[0].notes[0]
      : null
  );
  const [activeTab, setActiveTab] = useState("checklist");
  const [editingFolderId, setEditingFolderId] = useState(null);
>>>>>>> aef41d39cf7bf2f71d0dc115499b1ec06d9c6269

    fetchFolders();
  }, [userId, isProfessional]);

  // Buscar notas de uma pasta
  const fetchNotes = async (folderId) => {
    try {
      const url = `/notas?${isProfessional ? 'id_profissional' : 'id_paciente'}=${userId}&id_pasta=${folderId}`;
      const response = await fetch(url);
      let notes = await response.json();
      
      // Garante que todas as notas tenham conteúdo válido
      notes = notes.map(note => ({
        ...note,
        conteudo: note.conteudo || { checklist: [], imageNote: "" }
      }));
      
      const updatedFolders = folders.map(folder => 
        folder.id_pasta === folderId ? { ...folder, notes } : folder
      );
      
      setFolders(updatedFolders);
      setSelectedFolder(updatedFolders.find(f => f.id_pasta === folderId));
      setSelectedNote(notes.length > 0 ? notes[0] : null);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
    }
  };

  const handleCheck = (type, index) => {
    const updatedNote = { ...selectedNote };
    updatedNote.conteudo[type][index].done = !updatedNote.conteudo[type][index].done;
    updateNote(updatedNote);
  };

  const handleAddItem = (type) => {
    if (!selectedNote) return;
    
    const updated = {
      ...selectedNote,
      conteudo: {
        ...selectedNote.conteudo,
        [type]: [...(selectedNote.conteudo[type] || []), { text: "", done: false }]
      }
    };
    updateNote(updated);
  };

  const handleNewNote = async () => {
    if (!selectedFolder) return;

    const newNote = {
      titulo: "Nova Nota",
      conteudo: { checklist: [], imageNote: "" }
    };

    try {
      const response = await fetch('/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [isProfessional ? 'id_profissional' : 'id_paciente']: userId,
          id_pasta: selectedFolder.id_pasta,
          ...newNote
        })
      });

      await fetchNotes(selectedFolder.id_pasta);
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    }
  };

  const handleNewFolder = async () => {
    const newFolder = {
      nome: `Nova Pasta ${folders.length + 1}`
    };

<<<<<<< HEAD
    try {
      const response = await fetch('/pastas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [isProfessional ? 'id_profissional' : 'id_paciente']: userId,
          ...newFolder
        })
      });
=======
function navegar() {
    navigate(`/inicio`)
}

  return (
    <div className="notes-app">
      <div className="folders-sidebar">
        <img src={voltar} alt="seta-voltar" className="seta-voltar" onClick={navegar}/>
        <div className="header">
          <h2 className="title">Pastas</h2>
          <button onClick={handleNewFolder} className="btn add-folder">
            <Plus size={16} />
          </button>
        </div>
        <div className="folders-list">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={`folder-item ${
                  folder.id === selectedFolder?.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedFolder(folder);
                  setSelectedNote(folder.notes[0] || null);
                }}
              >
                {editingFolderId === folder.id ? (
                  <input
                    className="folder-name-input"
                    value={folder.name}
                    onChange={(e) => {
                      const updatedFolders = folders.map((f) =>
                        f.id === folder.id ? { ...f, name: e.target.value } : f
                      );
                      setFolders(updatedFolders);
                    }}
                    onBlur={() => setEditingFolderId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingFolderId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="tit-pasta">
                      <span>{folder.name}</span>
                    </div>
                    <div className="edit-nome-pasta">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </>
                )}
                <div className="excluir-pasta">
                  <button
                    className="delete-btnn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">Sem pastas</div>
          )}
        </div>
>>>>>>> aef41d39cf7bf2f71d0dc115499b1ec06d9c6269

      const createdFolder = await response.json();
      setFolders([createdFolder, ...folders]);
      setSelectedFolder(createdFolder);
      setSelectedNote(null);
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await fetch(`/pastas/${folderId}`, { method: 'DELETE' });
      const updatedFolders = folders.filter(f => f.id_pasta !== folderId);
      setFolders(updatedFolders);
      
      if (selectedFolder?.id_pasta === folderId) {
        setSelectedFolder(updatedFolders[0] || null);
        setSelectedNote(null);
        if (updatedFolders[0]) {
          fetchNotes(updatedFolders[0].id_pasta);
        }
      }
    } catch (error) {
      console.error("Erro ao deletar pasta:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(`/notas/${noteId}`, { method: 'DELETE' });
      await fetchNotes(selectedFolder.id_pasta);
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
    }
  };

  const updateNote = async (updatedNote) => {
    try {
      await fetch(`/notas/${updatedNote.id_nota}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: updatedNote.titulo,
          conteudo: updatedNote.conteudo
        })
      });
      
      const updatedNotes = selectedFolder.notes.map(n => 
        n.id_nota === updatedNote.id_nota ? updatedNote : n
      );
      
      const updatedFolder = {
        ...selectedFolder,
        notes: updatedNotes
      };
      
      setSelectedFolder(updatedFolder);
      setFolders(folders.map(f => 
        f.id_pasta === updatedFolder.id_pasta ? updatedFolder : f
      ));
      setSelectedNote(updatedNote);
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
    }
  };

  const updateFolderName = async (folderId, newName) => {
    try {
      await fetch(`/pastas/${folderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: newName })
      });
      
      setFolders(folders.map(f => 
        f.id_pasta === folderId ? { ...f, nome: newName } : f
      ));
    } catch (error) {
      console.error("Erro ao atualizar pasta:", error);
    }
  };

  const tabs = [
    { value: "checklist", label: "Lista" },
    { value: "imageNote", label: "Nota" },
  ];

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="notes-app">
      <div className="folders-sidebar">
        <img src={voltar} alt="seta-voltar" className="seta-voltar"/>
        <div className="header">
          <h2 className="title">Pastas</h2>
          <button onClick={handleNewFolder} className="btn add-folder">
            <Plus size={16} />
          </button>
        </div>
        <div className="folders-list">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <div
                key={folder.id_pasta}
                className={`folder-item ${
                  folder.id_pasta === selectedFolder?.id_pasta ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedFolder(folder);
                  fetchNotes(folder.id_pasta);
                }}
              >
                {editingFolderId === folder.id_pasta ? (
                  <input
                    className="folder-name-input"
                    value={folder.nome}
                    onChange={(e) => {
                      const updatedFolders = folders.map((f) =>
                        f.id_pasta === folder.id_pasta ? { ...f, nome: e.target.value } : f
                      );
                      setFolders(updatedFolders);
                    }}
                    onBlur={() => {
                      updateFolderName(folder.id_pasta, folder.nome);
                      setEditingFolderId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateFolderName(folder.id_pasta, folder.nome);
                        setEditingFolderId(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="tit-pasta">
                      <span>{folder.nome}</span>
                    </div>
                    <div className="edit-nome-pasta">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id_pasta);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </>
                )}
                <div className="excluir-pasta">
                  <button
                    className="delete-btnn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id_pasta);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">Sem pastas</div>
          )}
        </div>

        <div className="header">
          <h2 className="title">Notas</h2>
          <button 
            onClick={handleNewNote} 
            className="btn add-note"
            disabled={!selectedFolder}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="notes-list">
          {selectedFolder?.notes?.length > 0 ? (
            selectedFolder.notes.map((note) => (
              <div
                key={note.id_nota}
                className={`note-item ${
                  selectedNote?.id_nota === note.id_nota ? "selected" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <span className="note-text">{note.titulo}</span>
                <button
                  className="delete-btnn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id_nota);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-message">Sem notas</div>
          )}
        </div>
      </div>

      <div className="note-details">
        {selectedNote ? (
          <div>
            <input
              className="note-title-input"
              value={selectedNote.titulo}
              onChange={(e) => {
                const updated = { ...selectedNote, titulo: e.target.value };
                updateNote(updated);
              }}
            />

            <div className="custom-tabs-slider">
              <div
                className="slider-c"
                style={{
                  left: `${
                    tabs.findIndex((tab) => tab.value === activeTab) * 50
                  }%`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`tab-button ${
                    activeTab === tab.value ? "active" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "checklist" && (
              <div className="div-list">
                {selectedNote.conteudo.checklist?.map((item, i) => (
                  <div key={i} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.done || false}
                      className="check-c"
                      onChange={() => handleCheck("checklist", i)}
                    />
                    <div className="input-wrapper">
                      <input
                        value={item.text || ""}
                        onChange={(e) => {
                          const updated = { ...selectedNote };
                          updated.conteudo.checklist[i].text = e.target.value;
                          updateNote(updated);
                        }}
                        className="input-item"
                      />
                      <button
                        className="delete-btn"
                        onClick={() => {
                          const updated = { ...selectedNote };
                          updated.conteudo.checklist.splice(i, 1);
                          updateNote(updated);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleAddItem("checklist")}
                  className="btn add-item"
                >
                  Adicionar Item
                </button>
              </div>
            )}

            {activeTab === "imageNote" && (
              <div>
                <textarea
                  value={selectedNote.conteudo.imageNote || ""}
                  onChange={(e) => {
                    const updated = {
                      ...selectedNote,
                      conteudo: {
                        ...selectedNote.conteudo,
                        imageNote: e.target.value
                      }
                    };
                    updateNote(updated);
                  }}
                  className="textarea-note"
                  placeholder="Escreva sua nota aqui..."
                />
              </div>
            )}
          </div>
        ) : (
          <div className="no-note-selected">
            {selectedFolder ? "Selecione uma nota ou crie uma nova" : "Selecione uma pasta"}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesApp;