export default function Header() {
  return (
    <>
      <header className="fixed border-b-2 border-white flex w-full h-40 justify-around items-center bg-purple-700 content-center">
        <div className="flex text-3xl  h-fit">
          <p>Sign up</p>
        </div>

        <div>
          <h1 className="text-white font-bold text-5xl">ManageMe</h1>
        </div>
        <div>
          <p>All projects</p>
          <p>Pinned project</p>
        </div>
      </header>
    </>
  );
}
