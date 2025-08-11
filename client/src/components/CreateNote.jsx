import { useState, useRef, useEffect } from "react";

const COLORS = [
  "bg-amber-300",
  "bg-cyan-200",
  "bg-lime-300",
  "bg-red-300",
  "bg-indigo-300",
  "bg-gray-400",
];

function CreateNote({ onCreate, folderId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
    folderId,
    color: "",
  });

  const wrapperRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsExpanded(false);
        setNote({ title: "", content: "", folderId, color: "" });
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, folderId]);

  useEffect(() => {
    if (isExpanded && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isExpanded]);

  const setField = (field, value) =>
    setNote((prev) => ({ ...prev, [field]: value }));

  const handleCreate = (e) => {
    e.stopPropagation();
    if (!note.title.trim() && !note.content.trim()) return;

    onCreate({
      title: note.title.trim(),
      content: note.content.trim(),
      color: note.color,
      folderId: folderId || null,
    });

    setNote({ title: "", content: "", folderId, color: "" });
    setIsExpanded(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setNote({ title: "", content: "", folderId, color: "" });
    setIsExpanded(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="bg-white p-3 w-72 rounded-xl border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-md cursor-text"
      onClick={() => setIsExpanded(true)}
    >
      <input
        ref={titleRef}
        type="text"
        placeholder="Create a note..."
        className="w-full bg-transparent border-none outline-none text-lg font-medium"
        value={note.title}
        onChange={(e) => setField("title", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      />

      {isExpanded && (
        <div className="mt-2 space-y-2">
          <textarea
            placeholder="Write your note..."
            className="w-full bg-transparent border-none outline-none resize-none text-sm"
            rows={3}
            value={note.content}
            onChange={(e) => setField("content", e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("color", c);
                }}
                className={`w-6 h-6 rounded-full border-2 ${
                  note.color === c ? "border-gray-800" : "border-transparent"
                } ${c}`}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              type="button"
              className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              type="button"
              disabled={!note.title.trim() && !note.content.trim()}
              className={`px-3 py-1 text-sm rounded-lg text-white ${
                !note.title.trim() && !note.content.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-lime-500 hover:bg-lime-600"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateNote;
