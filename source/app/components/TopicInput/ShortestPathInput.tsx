import { ChangeEvent, useRef, useState } from "react";
import { MAX_M, MAX_N } from "@/app/constants";
import dijkstra from "@/app/algorthms/shortest_paths/dijkstra";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function MatrixInput() {}

export default function ShortestPathInput() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [source, setSource] = useState<number>(0);
  const matrixValue = useRef<any>(null);

  const onChangeMatrix = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const validateMatrix = (lines: Array<Array<any>>) => {
    const n = lines.length;
    const m = lines[0].length;

    if (n > MAX_N || m > MAX_M) throw new Error("Ma trận quá lớn");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    for (const [index, line] of lines.entries()) {
      if (line.length !== m)
        throw new Error(
          `dòng thứ ${index + 1} dài: ${line.length}, mong đợi ${m}`,
        );

      for (const item of line) {
        if (typeof item !== "number" || isNaN(item))
          throw new Error("Ma trận phải chứa số");
      }
    }
  };

  const formatMatrix = (text: string) => {
    const formattedInput = text
      .replace(/[^\d\s\n\-]/g, "")
      .replace(/[ ]{2,}/g, " ")
      .replace(/(?<=\d)\n+/g, "\n")
      .replace(/\s*\n\s*/g, "\n")
      .trim();

    setInput(formattedInput);
    return formattedInput
      .split("\n")
      .map((item) => item.split(" "))
      .map((item) => item.map(Number));
  };

  const onSuccess = (result: any) => {
    validateMatrix(result);
    setError("");
    matrixValue.current = result;
    const { dist, trace } = dijkstra(result, source);
    console.log({ dist, trace });
  };

  const handleMatrixValue = () => {
    if (!input) return;
    const lines = formatMatrix(input);
    try {
      validateMatrix(lines);
      onSuccess(lines);
    } catch (e: any) {
      matrixValue.current = [];
      setSource(0);
      setError(`Ma trận không hợp lệ: ${e.message}`);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <Label htmlFor="matrix">Ma Trận</Label>
        <Textarea
          id="matrix"
          className={cn("w-full h-36 resize-none", error && "border-red-500")}
          value={input}
          onChange={onChangeMatrix}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="mb-3">
        <Label htmlFor="source">Đỉnh bắt đầu</Label>
        <Input
          id="source"
          type="number"
          value={source}
          min={0}
          max={Math.max(0, matrixValue.current?.length - 1)}
          onChange={(e) => {
            setSource(Number(e.target.value));
          }}
        />
      </div>
      <button
        className="w-full bg-[#1F5CA9] text-white font-bold rounded py-2"
        onClick={() => handleMatrixValue()}
      >
        Sinh đồ thị
      </button>
    </div>
  );
}
