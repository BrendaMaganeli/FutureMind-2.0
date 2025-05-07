import { useState } from "react";
import { Plus } from "lucide-react";
import "./CSS/DiarioEmocional.css"; // Importando o arquivo CSS

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

export default function NotesApp() {
  const [folders, setFolders] = useState(initialData);
  const [selectedFolder, setSelectedFolder] = useState(folders[0]);
  const [selectedNote, setSelectedNote] = useState(folders[0].notes[0]);
  const [activeTab, setActiveTab] = useState("checklist");

  const handleCheck = (type, index) => {
    const updatedNote = { ...selectedNote };
    updatedNote[type][index].done = !updatedNote[type][index].done;
    const updatedFolder = {
      ...selectedFolder,
      notes: selectedFolder.notes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n,
      ),
    };
    setFolders(
      folders.map((f) => (f.name === selectedFolder.name ? updatedFolder : f)),
    );
    setSelectedFolder(updatedFolder);
    setSelectedNote(updatedNote);
  };

  const handleAddItem = (type) => {
    const updated = {
      ...selectedNote,
      [type]: [...selectedNote[type], { text: "", done: false }],
    };
    setSelectedNote(updated);
    const updatedFolder = {
      ...selectedFolder,
      notes: selectedFolder.notes.map((n) =>
        n.id === updated.id ? updated : n,
      ),
    };
    setFolders(
      folders.map((f) => (f.name === selectedFolder.name ? updatedFolder : f)),
    );
    setSelectedFolder(updatedFolder);
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
    setFolders(
      folders.map((f) => (f.name === selectedFolder.name ? updatedFolder : f)),
    );
    setSelectedFolder(updatedFolder);
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

  const tabs = [
    { value: "checklist", label: "Lista" },
    { value: "imageNote", label: "Nota" },
  ];

  return (
    <div className="notes-app">
      <div className="folders-sidebar">
        <div className="header">
          <h2 className="title">Pastas</h2>
          <button onClick={handleNewFolder} className="btn add-folder">
            <Plus size={16} />
          </button>
        </div>
        <div className="folders-list">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => {
                setSelectedFolder(folder);
                setSelectedNote(folder.notes[0] || null);
              }}
              className={`folder-item ${folder.id === selectedFolder.id ? "selected" : ""}`}
            >
              {folder.name}
            </div>
          ))}
        </div>

        <div className="header">
          <h2 className="title">Notas</h2>
          <button onClick={handleNewNote} className="btn add-note">
            <Plus size={16} />
          </button>
        </div>
        <div className="notes-list">
          {selectedFolder.notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`note-item ${selectedNote && selectedNote.id === note.id ? "selected" : ""}`}
            >
              <div className="note-title">
                <p className="note-text">{note.title}</p>
              </div>
            </div>
          ))}
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
                setSelectedNote(updated);
                const updatedFolder = {
                  ...selectedFolder,
                  notes: selectedFolder.notes.map((n) =>
                    n.id === updated.id ? updated : n,
                  ),
                };
                setFolders(
                  folders.map((f) =>
                    f.name === selectedFolder.name ? updatedFolder : f,
                  ),
                );
                setSelectedFolder(updatedFolder);
              }}
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
              <div>
                {selectedNote.checklist.map((item, i) => (
                  <div key={i} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleCheck("checklist", i)}
                    />
                    <input
                      value={item.text}
                      onChange={(e) => {
                        const updated = { ...selectedNote };
                        updated.checklist[i].text = e.target.value;
                        setSelectedNote(updated);
                        const updatedFolder = {
                          ...selectedFolder,
                          notes: selectedFolder.notes.map((n) =>
                            n.id === updated.id ? updated : n,
                          ),
                        };
                        setFolders(
                          folders.map((f) =>
                            f.name === selectedFolder.name ? updatedFolder : f,
                          ),
                        );
                        setSelectedFolder(updatedFolder);
                      }}
                      className="input-item"
                    />
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
                    setSelectedNote(updated);
                    const updatedFolder = {
                      ...selectedFolder,
                      notes: selectedFolder.notes.map((n) =>
                        n.id === updated.id ? updated : n,
                      ),
                    };
                    setFolders(
                      folders.map((f) =>
                        f.name === selectedFolder.name ? updatedFolder : f,
                      ),
                    );
                    setSelectedFolder(updatedFolder);
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
