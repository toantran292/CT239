import { useContext } from "react";
import { ResultOnlyInputContext } from "@/app/providers/ResultOnlyInput.provider";

export default function useResultOnly() {
  return useContext(ResultOnlyInputContext);
}
