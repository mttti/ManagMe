import Header from "./components/Header";
import Projects from "./components/Projects";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PinnedProject from "./components/PinnedProject";
import Tasks from "./components/Tasks";
import SignIn from "./components/SignIn";
import Notifications from "./components/Notifications";
import { useAuthContext } from "./hooks/useAuthContext";
function App() {
  const { user } = useAuthContext();

  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="flex">
          <section className="relative mb-10 w-full ">
            <Routes>
              <Route
                path="/"
                element={user ? <Projects /> : <Navigate to="/sign-in" />}
              ></Route>
              <Route
                path={`/pinned-project`}
                element={user ? <PinnedProject /> : <Navigate to="/sign-in" />}
              ></Route>
              <Route
                path="/pinned-project/:storyId/tasks"
                element={user ? <Tasks /> : <Navigate to="/sign-in" />}
              ></Route>
              <Route
                path="/sign-in"
                element={!user ? <SignIn /> : <Navigate to="/" />}
              ></Route>
              <Route
                path="/notifications"
                element={user ? <Notifications /> : <Navigate to="/" />}
              ></Route>
            </Routes>
          </section>
          {/* <LoggedUsers /> */}
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
