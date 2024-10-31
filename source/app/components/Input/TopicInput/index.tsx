import useGraph from "@/app/hooks/useGraph";
import { GRAPH_TOPIC } from "@/app/constants";
import ShortestPathInput from "@/app/components/Input/TopicInput/ShortestPathInput";
import MSTInput from "@/app/components/Input/TopicInput/MSTInput";

function InvalidTopicInput() {
  return <div>Invalid topic!</div>;
}

export default function TopicInput() {
  const { selectedTopic } = useGraph();
  switch (selectedTopic) {
    case GRAPH_TOPIC.SHORTEST_PATH:
      return <ShortestPathInput />;
    case GRAPH_TOPIC.MINIMUM_SPANNING_TREE:
      return <MSTInput />;
    default:
      return <InvalidTopicInput />;
  }
}
