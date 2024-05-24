import { useEffect, useState } from "react";
import { StoryType } from "../Types/storyType";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";

export default function Story({
  story,
  editStory,
  deleteStory,
}: {
  story: StoryType;
  editStory: (story: StoryType) => void;
  deleteStory: (id: string) => void;
}) {
  const [userToken, setUserToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const context = useAuthContext();
  let borderPriority: string;

  useEffect(() => {
    setUserToken(context.user.accessToken);
    if (userToken) {
      const decodedToken: { userRole: string } = jwtDecode(userToken);
      setUserRole(decodedToken.userRole);
    }
  }, [userRole, userToken]);

  if (story.priority === "HIGH") {
    borderPriority = "border-red-500";
  } else if (story.priority === "MEDIUM") {
    borderPriority = "border-orange-500";
  } else {
    borderPriority = "border-green-500";
  }

  return (
    <div
      className={`bg-cyan-800 dark:bg-zinc-800  border-2 ${borderPriority} text-white mt-5 p-2`}
    >
      <p className="text-xl">Name: {story.name}</p>

      <p className="text-xl">Description: {story.description}</p>
      <p className="text-xl">Priority: {story.priority}</p>
      <p className="text-xl">Date: {new Date(story.date).toDateString()}</p>
      <div className="flex justify-around mt-1">
        {userRole !== "DEVELOPER" ? (
          <>
            <button
              className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700"
              onClick={() => editStory(story)}
            >
              Edit
            </button>
            <button
              className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700"
              onClick={() => deleteStory(story.GUID)}
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
        <button className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700">
          <Link to={`/pinned-project/${story.GUID}/tasks`}>Tasks</Link>
        </button>
      </div>
    </div>
  );
}
