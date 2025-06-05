import { useState, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";
import "./CSS/DiarioEmocional.css";
import voltar from "../assets/seta-principal.svg";

const initialData = [
  {
    id: 1,
    name: "Notes",
    notes: [
      {
        id: 1,
        title: "Nota 1",
        checklist: [],
      },
    ],
  },
];

function NotesApp() {
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

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      checklist: [],
      imageNote: "",
    };
    const updatedFolder = {
      ...selectedFolder,
      notes: [newNote, ...selectedFolder.notes],
    };
    updateFolderState(updatedFolder);
    setSelectedNote(newNote);
  };

  const handleNewFolder = () => {
    const newFolder = {
      id: Date.now(),
      name: `Folder ${folders.length + 1}`,
      notes: [],
    };
    setFolders([newFolder, ...folders]);
    setSelectedFolder(newFolder);
    setSelectedNote(null);
  };

  const handleDeleteFolder = (folderId) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    setFolders(updatedFolders);
    if (selectedFolder?.id === folderId) {
      setSelectedFolder(updatedFolders[0] || null);
      setSelectedNote(updatedFolders[0]?.notes[0] || null);
    }
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = selectedFolder.notes.filter((n) => n.id !== noteId);
    const updatedFolder = { ...selectedFolder, notes: updatedNotes };
    updateFolderState(updatedFolder);
    setSelectedNote(updatedNotes[0] || null);
  };

  const updateNoteState = (updatedNote) => {
    const updatedFolder = {
      ...selectedFolder,
      notes: selectedFolder.notes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      ),
    };
    updateFolderState(updatedFolder);
    setSelectedNote(updatedNote);
  };

  const updateFolderState = (updatedFolder) => {
    setFolders(
      folders.map((f) => (f.id === updatedFolder.id ? updatedFolder : f))
    );
    setSelectedFolder(updatedFolder);
  };

  const tabs = [
    { value: "checklist", label: "Lista" },
    { value: "imageNote", label: "Nota" },
  ];

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
                <span className="note-text">{note.title}</span>
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
              value={selectedNote.title}
              onChange={(e) => {
                const updated = { ...selectedNote, title: e.target.value };
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
