import { useContext } from "react";
import { ShortestPathContext } from "@/app/contexts/ShortestPathContext";

export default function useShortestPath() {
  return useContext(ShortestPathContext);
}
