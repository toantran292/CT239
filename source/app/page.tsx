"use client";

import { AlgoRadio, TopicRadio } from "@/app/components/Radio";
import TopicInput from "@/app/components/TopicInput";
import GraphProvider from "@/app/contexts/GraphContext";
import GraphReactFlow from "@/app/components/GraphReactFlow";

export default function Home() {
  return (
    <GraphProvider>
      <div className="flex flex-row w-full h-full">
        <div className="w-1/4 p-3">
          <TopicRadio />
          <AlgoRadio />
          <TopicInput />
        </div>
        <GraphReactFlow />
      </div>
    </GraphProvider>
  );
}
