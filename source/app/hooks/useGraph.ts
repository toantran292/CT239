import { useContext } from "react";
import { GraphContext } from "@/app/contexts/GraphContext";

export default function useGraph() {
  return useContext(GraphContext);
}
