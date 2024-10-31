"use client";

import { AlgoRadio, TopicRadio } from "@/app/components/Radio";
import { Toaster } from "@/components/ui/toaster";
import TopicInput from "@/app/components/TopicInput";
import GraphProvider from "@/app/contexts/GraphContext";
import GraphReactFlow from "@/app/components/GraphReactFlow";
import ShortestPathProvider from "@/app/contexts/ShortestPathContext";
import useGraph from "@/app/hooks/useGraph";
import { GRAPH_TOPIC } from "@/app/constants";
import MatrixInputProvider from "@/app/providers/MatrixInput.provider";

const Content = () => {
  const { selectedTopic, selectedAlgo } = useGraph();

  switch (selectedTopic) {
    case GRAPH_TOPIC.SHORTEST_PATH:
      return <GraphReactFlow />;
    default:
      return <div>Nothing</div>;
  }
};

export default function Home() {
  return (
    <>
      <GraphProvider>
        <MatrixInputProvider>
          <ShortestPathProvider>
            <div className="flex flex-row w-full h-full">
              <div className="w-1/4 p-3">
                <TopicRadio />
                <AlgoRadio />
                <TopicInput />
              </div>
              <div className="flex-col flex-1 h-screen border-2 p-3">
                <Content />
              </div>
            </div>
          </ShortestPathProvider>
        </MatrixInputProvider>
      </GraphProvider>
      <Toaster />
    </>
  );
}
