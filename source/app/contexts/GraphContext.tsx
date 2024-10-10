import { createContext, PropsWithChildren, useState } from "react";
import { GRAPH_ALGO, GRAPH_TOPIC } from "@/app/constants";

export interface Graph {
  selectedTopic: GRAPH_TOPIC | null;
  onChangeSelectedTopic: (value: GRAPH_TOPIC | null) => void;
  selectedAlgo: GRAPH_ALGO | null;
  onChangeSelectedAlgo: (value: GRAPH_ALGO | null) => void;
}

export const GraphContext = createContext<Graph>({
  selectedTopic: null,
  onChangeSelectedTopic: () => {},
  selectedAlgo: null,
  onChangeSelectedAlgo: () => {},
});

export default function GraphProvider({ children }: PropsWithChildren) {
  const [selectedTopic, setSelectedTopic] = useState<GRAPH_TOPIC | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<GRAPH_ALGO | null>(null);

  const handleSetSelectedTopic = (value: GRAPH_TOPIC | null) => {
    console.log(value);
    setSelectedTopic(value);
    setSelectedAlgo(null);
  };

  const handleSetSelectedAlgo = (value: GRAPH_ALGO | null) => {
    setSelectedAlgo(value);
  };

  return (
    <GraphContext.Provider
      value={{
        selectedTopic,
        onChangeSelectedTopic: handleSetSelectedTopic,
        selectedAlgo,
        onChangeSelectedAlgo: handleSetSelectedAlgo,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}
