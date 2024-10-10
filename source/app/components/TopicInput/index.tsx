import useGraph from "@/app/hooks/useGraph";
import { GRAPH_TOPIC, MAX_M, MAX_N } from "@/app/constants";
import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";
import ShortestPathInput from "@/app/components/TopicInput/ShortestPathInput";

function InvalidTopicInput() {
  return <div>Invalid topic!</div>;
}

export default function TopicInput() {
  const { selectedTopic } = useGraph();
  switch (selectedTopic) {
    case GRAPH_TOPIC.SHORTEST_PATH:
      return <ShortestPathInput />;
    default:
      return <InvalidTopicInput />;
  }
}
