import {
  GRAPH_ALGO,
  GRAPH_ALGO_NAME,
  GRAPH_TOPIC,
  GRAPH_TOPIC_ALGOS,
  GRAPH_TOPIC_NAMES,
  GRAPH_TOPICS,
} from "@/app/constants";
import useGraph from "@/app/hooks/useGraph";
import { Label } from "@/components/ui/label";
import { ComboboxDemo } from "@/app/components/ui/Combobox";

export default function AlgoRadio() {
  const { selectedAlgo, selectedTopic, onChangeSelectedAlgo } = useGraph();
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
      <Label htmlFor="algo">Thuật toán:</Label>
      <ComboboxDemo
        id="algo"
        label="Chọn thuật toán..."
        emptyLabel="Thuật toán không tồn tại"
        options={
          GRAPH_TOPIC_ALGOS[selectedTopic || ("" as unknown as GRAPH_TOPIC)] ||
          []
        }
        options_name={GRAPH_ALGO_NAME}
        value={selectedAlgo}
        onChange={onChangeSelectedAlgo}
      />
    </div>
  );
}
