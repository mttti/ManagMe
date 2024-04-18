import { useState } from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import { User } from "./User";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PinnedProject from "./components/PinnedProject";

function App() {
  let user = new User();
  // const [pinnedProject, setPinnedProject] = useState("11");

  return (
    <>
      <BrowserRouter>
        <Header userName={user.userData.name} />
        <section className="relative mb-10">
          <Routes>
            <Route path="/all-projects" element={<Projects />}></Route>
            <Route path={`/pinned-project`} element={<PinnedProject />}></Route>
          </Routes>
        </section>
      </BrowserRouter>
    </>
  );
}

export default App;
