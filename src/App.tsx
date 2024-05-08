import Header from "./components/Header";
import Projects from "./components/Projects";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PinnedProject from "./components/PinnedProject";
import LoggedUsers from "./components/LoggedUsers";
import { UserApi } from "./api";
import Tasks from "./components/Tasks";
import SignIn from "./components/SignIn";

function App() {
  // let loggedUser = await UserApi.getAllUsers();
  let loggedUsers;
  async function getLoggedUser() {
    loggedUsers = await UserApi.getAllUsers();
  }
  getLoggedUser();
  // const [pinnedProject, setPinnedProject] = useState("11");

  return (
    <>
      <BrowserRouter>
        <Header userName={"janek"} />
        <div className="flex">
          <section className="relative mb-10 w-full ">
            <Routes>
              <Route path="/all-projects" element={<Projects />}></Route>
              <Route
                path={`/pinned-project`}
                element={<PinnedProject />}
              ></Route>
              <Route
                path="/pinned-project/:storyId/tasks"
                element={<Tasks></Tasks>}
              ></Route>
              <Route path="/sign-in" element={<SignIn />}></Route>
            </Routes>
          </section>
          <LoggedUsers />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
