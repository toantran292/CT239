import { useContext } from "react";
import { MatrixInputContext } from "@/app/providers/MatrixInput.provider";

export default function useMatrixInput() {
  return useContext(MatrixInputContext);
}
