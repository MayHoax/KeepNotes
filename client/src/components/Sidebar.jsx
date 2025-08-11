import FoldersList from "./FoldersList";

export default function Sidebar() {
  return (
    <aside className="w-48 border-r bg-gray-800 flex flex-col">
      <FoldersList />
    </aside>
  );
}
