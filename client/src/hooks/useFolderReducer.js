import { useReducer } from "react";
import { getToken } from "../utils/token";
import { useCallback } from "react";

const API_URL = "http://localhost:3000/api";

const initialState = {
  folders: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_FOLDERS":
      return { ...state, folders: action.payload, loading: false };
    case "ADD_FOLDER":
      return {
        ...state,
        folders: [...state.folders, action.payload],
        loading: false,
      };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folders: state.folders.map((f) =>
          f._id === action.payload._id ? action.payload : f
        ),
        loading: false,
      };
    case "REMOVE_FOLDER":
      return {
        ...state,
        folders: state.folders.filter((f) => f._id !== action.payload),
        loading: false,
      };
    default:
      return state;
  }
}

export function useFoldersReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchFolders = useCallback(async () => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_URL}/folders`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const data = await res.json();
      dispatch({ type: "SET_FOLDERS", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const createFolder = useCallback(async (name) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_URL}/folders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка создания папки");
      }
      const data = await res.json();
      dispatch({ type: "ADD_FOLDER", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const updateFolder = useCallback(async (id, name) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_URL}/folders/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка обновления папки");
      }
      const data = await res.json();
      dispatch({ type: "UPDATE_FOLDER", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const deleteFolder = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_URL}/folders/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка удаления папки");
      }
      dispatch({ type: "REMOVE_FOLDER", payload: id });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  return {
    folders: state.folders,
    loading: state.loading,
    error: state.error,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  };
}
