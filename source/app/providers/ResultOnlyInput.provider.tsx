import { createContext, PropsWithChildren, useState } from "react";

export interface IResultOnlyInputContext {
  resultOnly: boolean;
  toggleResultOnly: () => void;
}

const foo = () => undefined;
export const ResultOnlyInputContext = createContext<IResultOnlyInputContext>({
  resultOnly: false,
  toggleResultOnly: foo,
});

export default function ResultOnlyInputProvider({
  children,
}: PropsWithChildren) {
  const [resultOnly, setResultlOnly] = useState<boolean>(false);

  const toggleResultOnly = () => {
    setResultlOnly((prev) => !prev);
  };

  return (
    <ResultOnlyInputContext.Provider value={{ resultOnly, toggleResultOnly }}>
      {children}
    </ResultOnlyInputContext.Provider>
  );
}
