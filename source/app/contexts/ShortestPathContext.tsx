import { createContext, PropsWithChildren, useState } from "react";
import { MAX_M, MAX_N } from "@/app/constants";
import useGraph from "@/app/hooks/useGraph";
import { useToast } from "@/hooks/use-toast";

export interface IShortestPath {
  input: string;
  error: string;
  matrixValue: Array<Array<number>>;
  source: number;
  onSubmitMatrix: () => void;
  onFormatMatrix: () => void;
  handleSetInput: (value: string) => void;
  handleSetSource: (value: number) => void;
  onlyResult: boolean;
  toggleOnlyResult: () => void;
}

export const ShortestPathContext = createContext<IShortestPath>(
  {} as IShortestPath,
);

export function text2matrix(text: string) {
  const formattedInput = text
    .replace(/[^\d\s\n\-]/g, "")
    .replace(/[ ]{2,}/g, " ")
    .replace(/[-]{2,}/g, "-")
    .replace(/(\d)-(\d)/g, "$1$2")
    .replace(/(?<=\d)\n+/g, "\n")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
  const result = formattedInput
    .split("\n")
    .map((item) => item.split(" "))
    .map((item) => item.map(Number));

  return { formattedInput, result };
}

export const validateMatrix = (mat: Array<Array<any>>) => {
  const n = mat.length;
  const m = mat[0].length;

  if (n > MAX_N || m > MAX_M) throw new Error("Ma trận quá lớn");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  for (const [index, line] of mat.entries()) {
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

export default function ShortestPathProvider({ children }: PropsWithChildren) {
  const { selectedTopic, selectedAlgo } = useGraph();
  const { toast } = useToast();
  const [source, setSource] = useState<number>(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [onlyResult, setOnlyResult] = useState(false);
  const [matrixValue, setMatrixValue] = useState<any>([]);

  const onFormatMatrix = () => {
    console.log("onFormatMatrix");
    if (!input) return;
    const { formattedInput, result } = text2matrix(input);
    setInput(formattedInput);
    setMatrixValue(result);
  };

  const handleSetSource = (value: number) => {
    setSource(value);
  };
  const toggleOnlyResult = () => {
    setOnlyResult((prev) => !prev);
  };

  const handleSetInput = (value: string) => {
    setInput(value);
  };

  const handleSetError = (value: string) => {
    setError(value);
  };

  const onSubmitMatrix = () => {
    if (!selectedAlgo || !selectedTopic) {
      toast({
        variant: "destructive",
        title: "Chưa chọn chủ đề hoặc thuật toán",
      });
      return;
    }

    try {
      validateMatrix(matrixValue);
      setError("");
    } catch (e: any) {
      let message = e.message;
      if (e instanceof TypeError) {
        message = "Chưa nhập ma trận";
      }
      handleSetError(`Ma trận không hợp lệ: ${message}`);
    }
  };

  return (
    <ShortestPathContext.Provider
      value={{
        input,
        error,
        source,
        matrixValue,
        onlyResult,
        toggleOnlyResult,
        onSubmitMatrix,
        onFormatMatrix,
        handleSetInput,
        handleSetSource,
      }}
    >
      {children}
    </ShortestPathContext.Provider>
  );
}
