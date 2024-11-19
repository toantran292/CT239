"use client";

import { useMemo, useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Button, Input, Label } from "@/components/ui";

import {
  GraphInput,
  GraphProvider,
  useGraph,
} from "@/app/components/graph-input";
import { ALGORITHM_NAMES, TOPIC_NAMES, TOPICS } from "@/app/constants";
import { GraphReactFlow } from "@/app/components/graph-react-flow";
import { Combobox } from "@/app/components/ui/Combobox";
import { NEEDS_SOURCE } from "@/app/components/graph-input/util";

const AlgoInput = () => {
  const [selectedTopic, setSelectedTopic] = useState<TOPICS | undefined>();
  const {
    availableAlgorithms,
    selectedAlgorithm,
    source,
    handleSetSource,
    handleSelectAlgorithm,
    generateResultGraph,
  } = useGraph();

  const topics = useMemo(
    () => Object.keys(availableAlgorithms || {}),
    [availableAlgorithms],
  );

  if (!availableAlgorithms) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1">
          <Label htmlFor="topic">Chọn chủ đề</Label>
          <Combobox
            id="topic"
            label="Chọn chủ đề..."
            emptyLabel="Chủ đề không tồn tại"
            options={topics}
            options_name={TOPIC_NAMES}
            value={selectedTopic}
            onChange={(value: TOPICS) => {
              setSelectedTopic(value);
              handleSelectAlgorithm(undefined);
            }}
            meta={availableAlgorithms}
          />
        </div>
        {selectedTopic ? (
          <div className="flex-1">
            <Label htmlFor="algo">Chọn thuật toán</Label>
            <Combobox
              id="algo"
              label="Chọn thuật toán..."
              emptyLabel="Thuậtoán không tồn tại"
              options={availableAlgorithms[selectedTopic]}
              options_name={ALGORITHM_NAMES}
              value={selectedAlgorithm}
              onChange={handleSelectAlgorithm}
            />
          </div>
        ) : null}
      </div>
      {selectedTopic ? (
        <div className="flex gap-2">
          {NEEDS_SOURCE.includes(selectedTopic) ? (
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="source">Đỉnh nguồn</Label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  id="source"
                  value={source}
                  onChange={(e) => handleSetSource(Number(e.target.value))}
                />
                {selectedAlgorithm && source !== undefined ? (
                  <Button onClick={() => generateResultGraph()}>
                    Sinh kết quả
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {selectedAlgorithm ? (
                <Button
                  className="w-full"
                  onClick={() => generateResultGraph()}
                >
                  Sinh kết quả
                </Button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default function Home() {
  return (
    <>
      <GraphProvider>
        <div className="flex flex-row w-full h-full">
          <div className="w-1/4 p-3 flex flex-col gap-4">
            <GraphInput />
            <AlgoInput />
          </div>
          <div className="flex-col flex-1 h-screen border-2 p-3">
            <GraphReactFlow />
          </div>
        </div>
      </GraphProvider>
      <Toaster />
    </>
  );
}
