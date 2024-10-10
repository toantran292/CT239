import { GRAPH_TOPIC, GRAPH_TOPIC_NAMES, GRAPH_TOPICS } from "@/app/constants";
import useGraph from "@/app/hooks/useGraph";
import { useRef } from "react";
import { ComboboxDemo } from "@/app/components/ui/Combobox";
import { Label } from "@/components/ui/label";

export default function TopicRadio() {
  const { selectedTopic, onChangeSelectedTopic } = useGraph();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  console.log(inputRefs);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
      <Label htmlFor="topic">Chủ đề:</Label>
      <ComboboxDemo
        id="topic"
        label="Chọn chủ đề..."
        emptyLabel="Chủ đề không tồn tại"
        options={GRAPH_TOPICS}
        options_name={GRAPH_TOPIC_NAMES}
        value={selectedTopic}
        onChange={onChangeSelectedTopic}
      />
    </div>
  );
}
