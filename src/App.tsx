import { useState } from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PinnedProject from "./components/PinnedProject";
import LoggedUsers from "./components/LoggedUsers";
import { UserApi } from "./api";
import Tasks from "./components/Tasks";

function App() {
  let loggedUser = UserApi.getAllUsers();
  // const [pinnedProject, setPinnedProject] = useState("11");

  return (
    <>
      <BrowserRouter>
        <Header userName={loggedUser[0].userData.name} />
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
            </Routes>
          </section>
          <LoggedUsers />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
