import { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import "./CSS/DiarioEmocional.css";
import voltar from "../assets/seta-principal.svg";

function NotesApp() {
  const idPaciente = 1; // ajuste dinamicamente conforme necessário
  const idProfissional = null; // ou id do profissional

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("checklist");
  const [editingFolderId, setEditingFolderId] = useState(null);

  // Carrega pastas e notas do backend
  useEffect(() => {
    async function carregarPastasENotas() {
      try {
        const resPastas = await fetch(
          `http://localhost:4242/pasta?id_paciente=${idPaciente}&id_profissional=${idProfissional}`
        );
        const dataPastas = await resPastas.json();

        // Para cada pasta, buscar notas relacionadas
        const pastasComNotas = await Promise.all(
          dataPastas.map(async (pasta) => {
            const resNotas = await fetch(
              `http://localhost:4242/nota?id_paciente=${idPaciente}&id_profissional=${idProfissional}&id_pasta=${pasta.id_pasta}`
            );
            const notas = await resNotas.json();

            // Parse do conteúdo JSON das notas
            const notasParseadas = notas.map((nota) => {
              let conteudo = { checklist: [], imageNote: "" };
              try {
                conteudo = JSON.parse(nota.conteudo);
              } catch {
                // se der erro, mantém vazio
              }
              return {
                ...nota,
                checklist: conteudo.checklist || [],
                imageNote: conteudo.imageNote || "",
              };
            });

            return { ...pasta, notes: notasParseadas };
          })
        );

        setFolders(pastasComNotas);
        setSelectedFolder(pastasComNotas[0] || null);
        setSelectedNote(pastasComNotas[0]?.notes[0] || null);
      } catch (err) {
        console.error("Erro ao carregar pastas e notas:", err);
      }
    }

    carregarPastasENotas();
  }, [idPaciente, idProfissional]);

  // Função para atualizar pasta no backend e localmente
  const updateFolderState = (updatedFolder) => {
    setFolders((prev) =>
      prev.map((f) => (f.id_pasta === updatedFolder.id_pasta ? updatedFolder : f))
    );
    setSelectedFolder(updatedFolder);
  };

  // Função para atualizar nota no backend e localmente
  const updateNoteState = async (updatedNote) => {
    // Recriar conteúdo JSON para salvar no backend
    const conteudo = JSON.stringify({
      checklist: updatedNote.checklist,
      imageNote: updatedNote.imageNote,
    });

    try {
      await fetch(`http://localhost:4242/nota/${updatedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: updatedNote.titulo,
          conteudo,
          id_paciente: idPaciente,
          id_profissional: idProfissional,
          id_pasta: updatedNote.id_pasta,
        }),
      });

      const updatedFolder = {
        ...selectedFolder,
        notes: selectedFolder.notes.map((n) =>
          n.id === updatedNote.id ? updatedNote : n
        ),
      };
      updateFolderState(updatedFolder);
      setSelectedNote(updatedNote);
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
    }
  };

  // Criar nova pasta
  const handleNewFolder = async () => {
    try {
      const res = await fetch("http://localhost:4242/pasta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: `Nova Pasta`,
          id_paciente: idPaciente,
          id_profissional: idProfissional,
        }),
      });
      const novaPasta = await res.json();
      setFolders((prev) => [novaPasta, ...prev]);
      setSelectedFolder(novaPasta);
      setSelectedNote(null);
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    }
  };

  // Criar nova nota
  const handleNewNote = async () => {
    if (!selectedFolder) return;
    try {
      const res = await fetch("http://localhost:4242/nota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: "Nova Nota",
          conteudo: JSON.stringify({ checklist: [], imageNote: "" }),
          id_paciente: idPaciente,
          id_profissional: idProfissional,
          id_pasta: selectedFolder.id_pasta,
        }),
      });
      const novaNota = await res.json();
      novaNota.checklist = [];
      novaNota.imageNote = "";
      const updatedFolder = {
        ...selectedFolder,
        notes: [novaNota, ...selectedFolder.notes],
      };
      updateFolderState(updatedFolder);
      setSelectedNote(novaNota);
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    }
  };

  // Deletar pasta
  const handleDeleteFolder = async (idPasta) => {
    try {
      await fetch(`http://localhost:4242/pasta/${idPasta}`, {
        method: "DELETE",
      });
      const updatedFolders = folders.filter((f) => f.id_pasta !== idPasta);
      setFolders(updatedFolders);
      if (selectedFolder?.id_pasta === idPasta) {
        setSelectedFolder(updatedFolders[0] || null);
        setSelectedNote(updatedFolders[0]?.notes[0] || null);
      }
    } catch (error) {
      console.error("Erro ao deletar pasta:", error);
    }
  };

  // Deletar nota
  const handleDeleteNote = async (idNota) => {
    try {
      await fetch(`http://localhost:4242/nota/${idNota}`, {
        method: "DELETE",
      });
      const updatedNotes = selectedFolder.notes.filter((n) => n.id !== idNota);
      const updatedFolder = { ...selectedFolder, notes: updatedNotes };
      updateFolderState(updatedFolder);
      setSelectedNote(updatedNotes[0] || null);
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
    }
  };

  // Toggle checklist item done
  const handleCheck = (index) => {
    const updatedNote = { ...selectedNote };
    updatedNote.checklist[index].done = !updatedNote.checklist[index].done;
    updateNoteState(updatedNote);
  };

  // Adicionar item na checklist
  const handleAddItem = () => {
    const updated = {
      ...selectedNote,
      checklist: [...selectedNote.checklist, { text: "", done: false }],
    };
    updateNoteState(updated);
  };

  // Atualizar título da nota
  const handleTitleChange = (e) => {
    const updated = { ...selectedNote, titulo: e.target.value };
    updateNoteState(updated);
  };

  // Atualizar texto do item checklist
  const handleChecklistTextChange = (index, value) => {
    const updated = { ...selectedNote };
    updated.checklist[index].text = value;
    updateNoteState(updated);
  };

  // Excluir item checklist
  const handleDeleteChecklistItem = (index) => {
    const updated = { ...selectedNote };
    updated.checklist.splice(index, 1);
    updateNoteState(updated);
  };

  // Atualizar texto da nota livre (imageNote)
  const handleImageNoteChange = (e) => {
    const updated = { ...selectedNote, imageNote: e.target.value };
    updateNoteState(updated);
  };

  // Alterar nome da pasta localmente e no backend
  const handleRenameFolder = async (idPasta, novoNome) => {
    try {
      await fetch(`http://localhost:4242/pasta/${idPasta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome }),
      });
      const updatedFolders = folders.map((f) =>
        f.id_pasta === idPasta ? { ...f, nome: novoNome } : f
      );
      setFolders(updatedFolders);
      if (selectedFolder?.id_pasta === idPasta) {
        setSelectedFolder({ ...selectedFolder, nome: novoNome });
      }
    } catch (error) {
      console.error("Erro ao renomear pasta:", error);
    }
  };

  const tabs = [
    { value: "checklist", label: "Lista" },
    { value: "imageNote", label: "Nota" },
  ];

  return (
    <div className="notes-app">
      <div className="folders-sidebar">
        <div className="header">
          <img src={voltar} alt="seta-voltar" className="seta-voltar" />
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
                  setSelectedNote(folder.notes[0] || null);
                }}
              >
                {editingFolderId === folder.id_pasta ? (
                  <input
                  className="folder-name-input"
                    value={folder.nome}
                    onChange={(e) => {
                      const updatedFolders = folders.map((f) =>
                        f.id_pasta === folder.id_pasta
                          ? { ...f, nome: e.target.value }
                          : f
                      );
                      setFolders(updatedFolders);
                    }}
                    onBlur={() => {
                      setEditingFolderId(null);
                      const pastaEditada = folders.find(
                        (f) => f.id_pasta === folder.id_pasta
                      );
                      handleRenameFolder(folder.id_pasta, pastaEditada.nome);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingFolderId(null);
                        const pastaEditada = folders.find(
                          (f) => f.id_pasta === folder.id_pasta
                        );
                        handleRenameFolder(folder.id_pasta, pastaEditada.nome);
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
          <button onClick={handleNewNote} className="btn add-note">
            <Plus size={16} />
          </button>
        </div>
        <div className="notes-list">
          {selectedFolder?.notes?.length > 0 ? (
            selectedFolder.notes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${
                  selectedNote?.id === note.id ? "selected" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <span className="note-text">{note.titulo}</span>
                <button
                  className="delete-btnn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
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
              onChange={handleTitleChange}
            />

            <div className="custom-tabs-slider">
              <div
                className="slider-c"
                style={{
                  left: `${tabs.findIndex((tab) => tab.value === activeTab) * 50}%`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`tab-button ${activeTab === tab.value ? "active" : ""}`}
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
                      onChange={() => handleCheck(i)}
                    />
                    <div className="input-wrapper">
                      <input
                        value={item.text}
                        onChange={(e) => handleChecklistTextChange(i, e.target.value)}
                        className="input-item"
                      />
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteChecklistItem(i)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddItem} className="add-item-button">
                  + Adicionar item
                </button>
              </div>
            )}

            {activeTab === "imageNote" && (
              <textarea
                className="note-textarea"
                value={selectedNote.imageNote}
                onChange={handleImageNoteChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesApp;
