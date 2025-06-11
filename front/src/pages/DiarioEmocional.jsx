import { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import "./CSS/DiarioEmocional.css";
import voltar from "../assets/seta-principal.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function NotesApp() {
  const navigate = useNavigate();
  const { id_paciente, id_profissional } = useParams();
  
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("checklist");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega pastas ao iniciar
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const params = id_paciente ? { id_paciente } : { id_profissional };
        const response = await axios.get('/pastas', { params });

        const foldersData = Array.isArray(response.data) ? response.data : [];

        setFolders(foldersData);
        if (foldersData.length > 0) {
          setSelectedFolder(foldersData[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar pastas:", err);
        setFolders([])
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [id_paciente, id_profissional]);

  // Carrega notas quando uma pasta é selecionada
  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedFolder) return;
      
      try {
        const params = {
          id_pasta: selectedFolder.id_pasta,
          ...(id_paciente ? { id_paciente } : { id_profissional })
        };
        
        const response = await axios.get('/notas', { params });
        const notesWithParsedContent = response.data.map(note => ({
          ...note,
          checklist: note.conteudo?.checklist || [],
          imageNote: note.conteudo?.imageNote || ""
        }));
        
        if (notesWithParsedContent.length > 0) {
          setSelectedNote(notesWithParsedContent[0]);
        } else {
          setSelectedNote(null);
        }
      } catch (err) {
        console.error("Erro ao carregar notas:", err);
      }
    };

    fetchNotes();
  }, [selectedFolder, id_paciente, id_profissional]);

  function voltarTela() {
    navigate(-1);
  }

  const handleCheck = (type, index) => {
    const updatedNote = { ...selectedNote };
    updatedNote[type][index].done = !updatedNote[type][index].done;
    updateNoteState(updatedNote);
  };

  const handleAddItem = (type) => {
    const updated = {
      ...selectedNote,
      [type]: [...selectedNote[type], { text: "", done: false }],
    };
    updateNoteState(updated);
  };

  const handleNewNote = async () => {
    try {
      const newNoteData = {
        titulo: "Nova Nota",
        conteudo: { checklist: [], imageNote: "" },
        id_pasta: selectedFolder.id_pasta,
        ...(id_paciente ? { id_paciente } : { id_profissional })
      };

      const response = await axios.post('/notas', newNoteData);
      const newNote = {
        ...response.data,
        checklist: [],
        imageNote: ""
      };

      setSelectedFolder(prev => ({
        ...prev,
        notes: [newNote, ...prev.notes]
      }));
      setSelectedNote(newNote);
    } catch (err) {
      console.error("Erro ao criar nota:", err);
    }
  };

  const handleNewFolder = async () => {
    try {
      const newFolderData = {
        nome: `Nova Pasta ${folders.length + 1}`,
        ...(id_paciente ? { id_paciente } : { id_profissional })
      };

      const response = await axios.post('/pastas', newFolderData);
      const newFolder = {
        ...response.data,
        notes: []
      };

      setFolders([newFolder, ...folders]);
      setSelectedFolder(newFolder);
      setSelectedNote(null);
    } catch (err) {
      console.error("Erro ao criar pasta:", err);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`/pastas/${folderId}`);
      const updatedFolders = folders.filter((f) => f.id_pasta !== folderId);
      setFolders(updatedFolders);
      
      if (selectedFolder?.id_pasta === folderId) {
        setSelectedFolder(updatedFolders[0] || null);
        setSelectedNote(updatedFolders[0]?.notes[0] || null);
      }
    } catch (err) {
      console.error("Erro ao deletar pasta:", err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`/notas/${noteId}`);
      const updatedNotes = selectedFolder.notes.filter((n) => n.id_nota !== noteId);
      const updatedFolder = { ...selectedFolder, notes: updatedNotes };
      
      setSelectedFolder(updatedFolder);
      setSelectedNote(updatedNotes[0] || null);
    } catch (err) {
      console.error("Erro ao deletar nota:", err);
    }
  };

  const updateNoteState = async (updatedNote) => {
    try {
      const noteData = {
        titulo: updatedNote.titulo,
        conteudo: {
          checklist: updatedNote.checklist,
          imageNote: updatedNote.imageNote
        }
      };

      await axios.put(`/notas/${updatedNote.id_nota}`, noteData);
      
      const updatedFolder = {
        ...selectedFolder,
        notes: selectedFolder.notes.map((n) =>
          n.id_nota === updatedNote.id_nota ? updatedNote : n
        ),
      };
      
      setSelectedFolder(updatedFolder);
      setSelectedNote(updatedNote);
    } catch (err) {
      console.error("Erro ao atualizar nota:", err);
    }
  };

  const updateFolderName = async (folderId, newName) => {
    try {
      await axios.put(`/pastas/${folderId}`, { nome: newName });
      const updatedFolders = folders.map((f) =>
        f.id_pasta === folderId ? { ...f, nome: newName } : f
      );
      setFolders(updatedFolders);
      setEditingFolderId(null);
    } catch (err) {
      console.error("Erro ao atualizar pasta:", err);
    }
  };

  const tabs = [
    { value: "checklist", label: "Lista" },
    { value: "imageNote", label: "Nota" },
  ];

  if (loading) return <div>Carregando...</div>;

  console.log('Folders data:', folders);

  return (
    <div className="notes-app">
      <div className="folders-sidebar">
        <div className="header">
        <img src={voltar} alt="seta-voltar" onClick={voltarTela} className="seta-voltar"/>
          <h2 className="title">Pastas</h2>
          <button onClick={handleNewFolder} className="btn add-folder">
            <Plus size={16} />
          </button>
        </div>
        {/* Substitua o código atual por este: */}
<div className="folders-list">
  {Array.isArray(folders) && folders.length > 0 ? (
    folders.map((folder) => (
      <div
        key={folder.id_pasta}
        className={`folder-item ${
          selectedFolder?.id_pasta === folder.id_pasta ? "selected" : ""
        }`}
        onClick={() => {
          setSelectedFolder(folder);
          setSelectedNote(null); // Reset da nota selecionada
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
            onBlur={() => updateFolderName(folder.id_pasta, folder.nome)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFolderName(folder.id_pasta, folder.nome);
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
          <button onClick={handleNewNote} className="btn add-note">
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
        {selectedNote && (
          <div>
            <input
              className="note-title-input"
              value={selectedNote.titulo}
              onChange={(e) => {
                const updated = { ...selectedNote, titulo: e.target.value };
                updateNoteState(updated);
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
                {selectedNote.checklist.map((item, i) => (
                  <div key={i} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.done}
                      className="check-c"
                      onChange={() => handleCheck("checklist", i)}
                    />
                    <div className="input-wrapper">
                      <input
                        value={item.text}
                        onChange={(e) => {
                          const updated = { ...selectedNote };
                          updated.checklist[i].text = e.target.value;
                          updateNoteState(updated);
                        }}
                        className="input-item"
                      />
                      <button
                        className="delete-btn"
                        onClick={() => {
                          const updated = { ...selectedNote };
                          updated.checklist.splice(i, 1);
                          updateNoteState(updated);
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
                  Add Item
                </button>
              </div>
            )}

            {activeTab === "imageNote" && (
              <div>
                <textarea
                  value={selectedNote.imageNote}
                  onChange={(e) => {
                    const updated = {
                      ...selectedNote,
                      imageNote: e.target.value,
                    };
                    updateNoteState(updated);
                  }}
                  className="textarea-note"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesApp;
