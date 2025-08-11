import { useReducer, useCallback } from "react";
import { getToken } from "../utils/token";

const API_URL = "http://localhost:3000/api/notes";

function reducer(state, action) {
  switch (action.type) {
    case "set":
      return action.payload;
    case "add":
      return [action.payload, ...state];
    case "update":
      return state.map((note) =>
        note._id === action.payload._id ? action.payload : note
      );
    case "delete":
      return state.filter((note) => note._id !== action.payload);
    default:
      return state;
  }
}

export function useNotesReducer() {
  const [notes, dispatch] = useReducer(reducer, []);

  const getHeaders = useCallback(() => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
      const data = await res.json();
      dispatch({ type: "set", payload: data });
    } catch (error) {
      console.error("fetchNotes error:", error);
    }
  }, [getHeaders]);

  const fetchNotesByFolder = useCallback(
    async (folderId) => {
      try {
        const res = await fetch(`${API_URL}?folderId=${folderId}`, {
          headers: getHeaders(),
        });
        if (!res.ok)
          throw new Error(`Failed to fetch folder notes: ${res.status}`);
        const data = await res.json();
        dispatch({ type: "set", payload: data });
      } catch (error) {
        console.error("fetchNotesByFolder error:", error);
      }
    },
    [getHeaders]
  );

  const createNote = useCallback(
    async (noteData) => {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(noteData),
        });
        if (!res.ok) throw new Error(`Failed to create note: ${res.status}`);
        const data = await res.json();
        dispatch({ type: "add", payload: data });
        return data;
      } catch (error) {
        console.error("createNote error:", error);
      }
    },
    [getHeaders]
  );

  const updateNote = useCallback(
    async (id, updates) => {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error(`Failed to update note: ${res.status}`);
        const data = await res.json();
        dispatch({ type: "update", payload: data });
        return data;
      } catch (error) {
        console.error("updateNote error:", error);
      }
    },
    [getHeaders]
  );

  const deleteNote = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
        dispatch({ type: "delete", payload: id });
      } catch (error) {
        console.error("deleteNote error:", error);
      }
    },
    [getHeaders]
  );

  return {
    notes,
    fetchNotes,
    fetchNotesByFolder,
    createNote,
    updateNote,
    deleteNote,
  };
}
