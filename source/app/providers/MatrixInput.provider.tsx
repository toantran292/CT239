import { createContext, PropsWithChildren, useState } from "react";
import { MAX_M, MAX_N } from "@/app/constants";

export interface IMatrixInputContext {
  value: string;
  error: string | null;
  matrix: number[][];
  setValue: (v: string) => void;
  setError: (v: string) => void;
  onBlur: () => void;
  onValidateError: (e: any) => void;
}

const foo = () => undefined;
export const MatrixInputContext = createContext<IMatrixInputContext>({
  value: "",
  error: null,
  matrix: [],
  setValue: foo,
  setError: foo,
  onBlur: foo,
  onValidateError: foo,
});

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

export default function MatrixInputProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<number[][]>([]);

  const handleSetValue = (v: string) => {
    setValue(v);
  };

  const handleSetError = (v: string) => {
    setError(v);
  };

  const onValidateError = (e: any) => {
    let message = e.message;
    if (e instanceof TypeError) {
      message = "Chưa nhập ma trận";
    }
    handleSetError(`Ma trận không hợp lệ: ${message}`);
  };

  const onBlur = () => {
    if (!value) return;
    const { formattedInput, result } = text2matrix(value);

    try {
      validateMatrix(result);
      setError(null);
      setValue(formattedInput);
      setMatrix(result);
    } catch (e: any) {
      onValidateError(e);
    }
  };

  return (
    <MatrixInputContext.Provider
      value={{
        value,
        error,
        matrix,
        setValue: handleSetValue,
        setError: handleSetError,
        onBlur,
        onValidateError,
      }}
    >
      {children}
    </MatrixInputContext.Provider>
  );
}
