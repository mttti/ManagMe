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
    <div className="bg-purple-300 mt-5 p-2">
      <p>Id: {story.GUID}</p>
      <p>Name: {story.name}</p>
      <p>Description: {story.description}</p>
      <p>Priority: {story.priority}</p>
      <p>Project Id: {story.projectId}</p>
      <p>Date: {story.date.toString()}</p>
      <p>Owner Id: {story.ownerId}</p>
      <button className="mr-5 cursor-pointer" onClick={() => editStory(story)}>
        Edit
      </button>
      <button
        className="cursor-pointer"
        onClick={() => deleteStory(story.GUID)}
      >
        Delete
      </button>
      <br />
      <Link to={`/pinned-project/${story.GUID}/tasks`}>Tasks</Link>
    </div>
  );
}
