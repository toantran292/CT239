import { createContext, PropsWithChildren } from "react";

export interface IMST {}

export const MSTContext = createContext<IMST>({});

export default function MSTProvider({ children }: PropsWithChildren) {
  return <MSTContext.Provider value={{}}>{children}</MSTContext.Provider>;
}
