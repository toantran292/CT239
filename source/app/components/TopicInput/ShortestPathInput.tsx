import { cn } from "@/lib/utils";
import { Checkbox, Input, Label } from "@/components/ui";
import useShortestPath from "@/app/hooks/useShortestPath";
import MatrixInput from "@/app/components/MatrixInput";

export default function ShortestPathInput() {
  const { source, errorSource, onlyResult, handleSetSource, toggleOnlyResult } =
    useShortestPath();

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
      <div className="grid w-full items-center gap-1.5 mb-3">
        <Label htmlFor="only-result">Chỉ hiện đường kết quả</Label>
        <Checkbox
          id="only-result"
          checked={onlyResult}
          onClick={toggleOnlyResult}
        />
      </div>
    </div>
  );
}
