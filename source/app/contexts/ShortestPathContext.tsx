import { createContext, PropsWithChildren, useEffect, useState } from "react";
import useMatrixInput from "@/app/hooks/useMatrixInput";

export interface IShortestPath {
  source: number;
  errorSource: string | null;
  onlyResult: boolean;
  handleSetSource: (value: number) => void;
  toggleOnlyResult: () => void;
}

export const ShortestPathContext = createContext<IShortestPath>(
  {} as IShortestPath,
);

export default function ShortestPathProvider({ children }: PropsWithChildren) {
  const { matrix } = useMatrixInput();

  const [source, setSource] = useState<number>(0);
  const [errorSource, setErrorSource] = useState<string | null>(null);

  const [onlyResult, setOnlyResult] = useState(false);

  const handleSetSource = (v: number) => {
    if (v < 0 || v >= Math.max(matrix?.length || 0, matrix?.[0]?.length || 0)) {
      setErrorSource(
        `Đỉnh không hợp lệ: 0 <= v < ${Math.max(matrix?.length || 0, matrix?.[0]?.length || 0)}`,
      );
    } else {
      setErrorSource("");
    }
    setSource(v);
  };

  const toggleOnlyResult = () => {
    setOnlyResult((prev) => !prev);
  };

  useEffect(() => {
    setSource(0);
  }, [matrix]);

  return (
    <ShortestPathContext.Provider
      value={{
        source,
        errorSource,
        onlyResult,
        toggleOnlyResult,
        handleSetSource,
      }}
    >
      {children}
    </ShortestPathContext.Provider>
  );
}
