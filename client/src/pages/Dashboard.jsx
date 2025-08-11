// pages/Dashboard.jsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNoteContext } from "../context/NotesContext";
import { useFolders } from "../context/FoldersContext";
import CreateNote from "../components/CreateNote";
import { NoteCard } from "../components/NoteCard";

export default function Dashboard() {
  console.log("Dashboard rendered");
  const { folderId } = useParams();
  console.log("Folder ID:", folderId);

  const {
    notes,
    fetchNotes,
    fetchNotesByFolder,
    createNote,
    updateNote,
    deleteNote,
  } = useNoteContext();
  const { folders } = useFolders();

  const currentFolder = folders.find((f) => f._id === folderId);

  useEffect(() => {
    if (folderId !== undefined) {
      fetchNotesByFolder(folderId);
    } else {
      fetchNotes();
    }
  }, [folderId]);

  const displayedNotes = folderId
    ? notes
    : notes.filter((note) => note.folderId === null);

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <div className="flex justify-center">
        <CreateNote onCreate={createNote} folderId={folderId || null} />
      </div>

      {displayedNotes.length === 0 ? (
        <p className="mt-70 text-center text-5xl font-mono uppercase text-gray-400">
          No notes yet {currentFolder ? `in ${currentFolder.name}` : ""}
        </p>
      ) : (
        displayedNotes.map((note) => (
          <NoteCard
            key={note._id}
            color={note.color}
            title={note.title}
            content={note.content}
            onDelete={() => deleteNote(note._id)}
            onUpdate={(newData) => updateNote(note._id, newData)}
          />
        ))
      )}
    </div>
  );
}
