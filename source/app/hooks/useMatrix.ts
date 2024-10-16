import { useContext } from "react";
import { MatrixContext } from "@/app/contexts/MatrixContext";

export default function useMatrix() {
  return useContext(MatrixContext);
}
