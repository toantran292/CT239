import { cn } from "@/lib/utils";
import { Input, Label } from "@/components/ui";
import useShortestPath from "@/app/hooks/useShortestPath";
import MatrixInput from "../MatrixInput";
import ResultOnlyCheckbox from "@/app/components/Checkbox/ResultOnlyCheckbox";

export default function ShortestPathInput() {
  const { source, errorSource, handleSetSource } = useShortestPath();

  return (
    <div className="w-full">
      <MatrixInput
        containerClassName="grid w-full items-center gap-1.5 mb-3"
        label="Ma Trận (N, M <= 10)"
      />

      <div className="grid w-full items-center gap-1.5 mb-3">
        <Label htmlFor="source">Đỉnh bắt đầu</Label>
        <Input
          id="source"
          type="number"
          className={cn(errorSource && "border-red-500")}
          value={source}
          onChange={(e) => {
            handleSetSource(Number(e.target.value));
          }}
        />
        {errorSource && <p className="text-sm text-red-600">{errorSource}</p>}
      </div>
      <ResultOnlyCheckbox
        label="Chỉ hiện đường kết quả"
        containerClassName="grid w-full items-center gap-1.5 mb-3"
      />
    </div>
  );
}
