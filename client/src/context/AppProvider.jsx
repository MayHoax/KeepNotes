import { FoldersProvider } from "./FoldersContext";
import { NoteProvider } from "./NotesContext";
import { AuthProvider } from "./AuthContext";
function AppProvider({ children }) {
  return (
    <>
      <AuthProvider>
        <FoldersProvider>
          <NoteProvider>{children}</NoteProvider>
        </FoldersProvider>
      </AuthProvider>
    </>
  );
}

export default AppProvider;
