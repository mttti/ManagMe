import { Link } from "react-router-dom";

export default function Header({ userName }: { userName: string }) {
  return (
    <>
      <header className="border-b-2 border-white flex w-full h-40 justify-around items-center bg-purple-700 content-center">
        <div className="flex text-3xl  h-fit">
          <p>{userName ? `Hello, ${userName}` : "Log in"}</p>
        </div>

        <div>
          <h1 className="text-white font-bold text-5xl">ManageMe</h1>
        </div>
        <div>
          <p>
            <Link to="/all-projects">All projects</Link>
          </p>
          <p>
            <Link to="/pinned-project">Pinned project</Link>
          </p>
        </div>
      </header>
    </>
  );
}
