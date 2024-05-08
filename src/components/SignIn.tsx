export default function SignIn() {
  return (
    <div className="bg-purple-400 flex flex-col p-10 items-center m-1">
      <input
        type="text"
        name="login"
        id="login"
        placeholder="Login"
        className="w-fit p-4 mb-10"
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        className="w-fit p-4"
      />
      <button className="mt-5 bg-purple-300 p-2 rounded-md">Login</button>
    </div>
  );
}
