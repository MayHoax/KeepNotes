import { useState, useRef, useEffect } from "react";
import { DeleteIcon } from "./svg-icons/DeleteIcon";
import { EditIcon } from "./svg-icons/EditIcon";

export function NoteCard({ title, content, color, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ title, content, color });
  const titleRef = useRef(null);

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!editedNote.title.trim() && !editedNote.content.trim()) return;
    onUpdate(editedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNote({ title, content, color });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-2 w-1/6 rounded-xl border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-md relative">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 font-medium text-xl m-2 mb-1 ">
              {title}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-600 hover:text-blue-600"
                title="Edit Note"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-xs text-gray-600 hover:text-red-600"
                title="Delete Note"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-lg m-2 ">{content}</p>

          {color && (
            <div
              className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border border-gray-300  ${color}`}
            ></div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <input
            ref={titleRef}
            type="text"
            placeholder="Note title"
            className="w-full bg-transparent border-none outline-none text-lg font-medium"
            value={editedNote.title}
            onChange={(e) =>
              setEditedNote((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            placeholder="Note content"
            className="w-full bg-transparent border-none outline-none resize-none text-sm"
            rows={3}
            value={editedNote.content}
            onChange={(e) =>
              setEditedNote((prev) => ({ ...prev, content: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm rounded-lg bg-lime-500 text-white hover:bg-lime-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
