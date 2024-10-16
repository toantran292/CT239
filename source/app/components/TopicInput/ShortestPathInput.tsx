import { ChangeEvent, useRef, useState } from "react";
import { MAX_M, MAX_N } from "@/app/constants";
import dijkstra from "@/app/algorthms/shortest_paths/dijkstra";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import useMatrix from "@/app/hooks/useMatrix";

export default function ShortestPathInput() {
  const {
    input,
    error,
    handleSetInput,
    onSubmitMatrix,
    matrixValue,
    onFormatMatrix,
  } = useMatrix();
  const [source, setSource] = useState<number>(0);
  const [errorSource, setErrorSource] = useState<string>("");

  const handleSetSource = (v: number) => {
    if (
      v < 0 ||
      v >= Math.max(matrixValue?.length || 0, matrixValue?.[0]?.length || 0)
    ) {
      setErrorSource(
        `Đỉnh không hợp lệ: 0 <= v < ${Math.max(matrixValue?.length || 0, matrixValue?.[0]?.length || 0)}`,
      );
    } else {
      setErrorSource("");
    }
    setSource(v);
  };

  return (
    <div className="w-full">
      <div className="grid w-full items-center gap-1.5 mb-3">
        <Label htmlFor="matrix">{"Ma Trận (N, M <= 10)"}</Label>
        <Textarea
          id="matrix"
          className={cn("w-full h-36 resize-none", error && "border-red-500")}
          value={input}
          onChange={(e) => handleSetInput(e.target.value)}
          onBlur={() => onFormatMatrix()}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

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
      <button
        className="w-full bg-[#1F5CA9] text-white font-bold rounded py-2"
        onClick={() => onSubmitMatrix()}
      >
        Sinh đồ thị
      </button>
    </div>
  );
}
