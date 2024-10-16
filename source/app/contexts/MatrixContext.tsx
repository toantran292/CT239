import { createContext, PropsWithChildren, useRef, useState } from "react";
import { MAX_M, MAX_N } from "@/app/constants";

export interface IMatrix {
  input: string;
  error: string;
  matrixValue: Array<Array<number>>;
  onSubmitMatrix: () => void;
  onFormatMatrix: () => void;
  handleSetInput: (value: string) => void;
}

export const MatrixContext = createContext<IMatrix>({} as IMatrix);

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

export default function MatrixProvider({ children }: PropsWithChildren) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [matrixValue, setMatrixValue] = useState<any>([]);

  const onFormatMatrix = () => {
    console.log("onFormatMatrix");
    if (!input) return;
    const { formattedInput, result } = text2matrix(input);
    setInput(formattedInput);
    setMatrixValue(result);
  };
  const handleSetInput = (value: string) => {
    setInput(value);
  };

  const handleSetError = (value: string) => {
    setError(value);
  };

  const onSubmitMatrix = () => {
    try {
      validateMatrix(matrixValue);
      setError("");
    } catch (e: any) {
      handleSetError(`Ma trận không hợp lệ: ${e.message}`);
    }
  };

  return (
    <MatrixContext.Provider
      value={{
        input,
        error,
        matrixValue,
        onSubmitMatrix,
        onFormatMatrix,
        handleSetInput,
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
}
