import { createContext, PropsWithChildren, useEffect, useState } from "react";
import useMatrixInput from "@/app/hooks/useMatrixInput";

export interface IShortestPath {
  source: number;
  errorSource: string | null;
  handleSetSource: (value: number) => void;
}

export const ShortestPathContext = createContext<IShortestPath>(
  {} as IShortestPath,
);

export default function ShortestPathProvider({ children }: PropsWithChildren) {
  const { matrix } = useMatrixInput();

  const [source, setSource] = useState<number>(-1);
  const [errorSource, setErrorSource] = useState<string | null>(null);

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

  useEffect(() => {
    setSource(0);
  }, [matrix]);

  return (
    <ShortestPathContext.Provider
      value={{
        source,
        errorSource,
        handleSetSource,
      }}
    >
      {children}
    </ShortestPathContext.Provider>
  );
}
