import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { logout } = useContext(AuthContext);
  return (
    <header className="bg-gray-800 flex items-center justify-between py-2 ">
      <h1 className=" text-white text-xl whitespace-nowrap p-2 pl-4  ">
        Keep Notes
      </h1>
      <input
        className="bg-gray-200 ml-16  p-2 pl-4 my-1 rounded-xl placeholder:pl-1  focus:outline-lime-300"
        placeholder="Search..."
      />
      <button className="text-white pr-4" onClick={logout}>
        Logout
      </button>
    </header>
  );
}
