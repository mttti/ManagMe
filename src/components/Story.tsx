import { StoryType } from "../Types/storyType";
import { Link } from "react-router-dom";

export default function Story({
  story,
  editStory,
  deleteStory,
}: {
  story: StoryType;
  editStory: (story: StoryType) => void;
  deleteStory: (id: string) => void;
}) {
  return (
    <div className="bg-cyan-800 dark:bg-zinc-800  border-2 border-white text-white mt-5 p-2">
      <p className="text-xl">Name: {story.name}</p>
      <p className="text-xl">Description: {story.description}</p>
      <p className="text-xl">Priority: {story.priority}</p>
      <p className="text-xl">Date: {new Date(story.date).toDateString()}</p>
      <p className="text-xl">Owner Id: {story.ownerId}</p>
      <div className="flex justify-around mt-1">
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
        <button className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700">
          <Link to={`/pinned-project/${story.GUID}/tasks`}>Tasks</Link>
        </button>
      </div>
    </div>
  );
}
