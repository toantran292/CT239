import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { Button, Label, Textarea } from "@/components/ui";
import { ALGORITHMS, MAX_M, MAX_N } from "@/app/constants";
import { checkAlgorithms } from "@/lib/utils";
import {
  buildEdge,
  buildNode,
  getResultGraph,
} from "@/app/components/graph-input/util";
import { useToast } from "@/hooks/use-toast";

export interface GraphProviderValue {
  matrix: number[][];
  graph: { nodes: any[]; edges: any[] };
  resultGraph: { nodes: any[]; edges: any[] };
  availableAlgorithms?: Record<string, string[]>;
  selectedAlgorithm?: ALGORITHMS;
  setGraph: (mat: number[][]) => void;
  source?: number;
  handleSelectAlgorithm: (value: ALGORITHMS | undefined) => void;
  handleSetSource: (value: number | undefined) => void;
  generateResultGraph: () => void;
}

export const GraphContext = createContext<GraphProviderValue>({
  matrix: [],
  graph: { nodes: [], edges: [] },
  resultGraph: { nodes: [], edges: [] },
  setGraph: () => {},
  handleSelectAlgorithm: () => {},
  handleSetSource: () => {},
  generateResultGraph: () => {},
});

export const useGraph = () => {
  return useContext(GraphContext);
};

export const GraphProvider = ({ children }: PropsWithChildren) => {
  const { toast } = useToast();
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [graph, setGraph] = useState<{ nodes: any[]; edges: any[] }>({
    nodes: [],
    edges: [],
  });
  const [resultGraph, setResultGraph] = useState<{
    nodes: any[];
    edges: any[];
  }>({
    nodes: [],
    edges: [],
  });
  // availableAlgorithms:
  const [availableAlgorithms, setAvailableAlgorithms] = useState<
    Record<string, string[]> | undefined
  >();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    ALGORITHMS | undefined
  >();
  const [source, setSource] = useState<number | undefined>();

  const handleSetSource = (value: number | undefined) => {
    setSource(value);
  };

  const handleSelectAlgorithm = (algo: ALGORITHMS | undefined) => {
    setSelectedAlgorithm(algo);
  };

  const handleSetGraph = (mat: number[][]) => {
    setGraph(matrix2graph(mat));
    setResultGraph(matrix2graph(mat));
    setMatrix(mat);
    setAvailableAlgorithms(checkAlgorithms(mat));
  };

  const generateResultGraph = () => {
    if (!selectedAlgorithm) return;
    const { nodes, edges, error } = getResultGraph(
      selectedAlgorithm,
      matrix,
      source,
    );

    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        variant: "destructive",
      });
    }

    setResultGraph({ nodes, edges });
  };

  return (
    <GraphContext.Provider
      value={{
        matrix,
        graph,
        resultGraph,
        availableAlgorithms,
        setGraph: handleSetGraph,
        selectedAlgorithm,
        handleSelectAlgorithm,
        source,
        handleSetSource,
        generateResultGraph,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const isDirectedGraph = (matrix: number[][]) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== matrix[j][i]) {
        return true;
      }
    }
  }
  return false;
};

export const text2matrix = (text: string) => {
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
};

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

export const matrix2graph = (mat: Array<Array<any>>) => {
  const isDirected = isDirectedGraph(mat);

  const nodes = mat.map((_, i) => {
    return buildNode(i);
  });

  const edges = mat.flatMap((line, i) => {
    return line
      .map((item, j) => {
        return buildEdge(i, j, String(mat[i][j]), isDirected);
      })
      .filter((edge) => {
        return (
          edge.source !== edge.target &&
          edge.weight !== "0" &&
          (isDirected || edge.source < edge.target)
        );
      });
  });

  return { nodes, edges };
};

const useTextToGraph = () => {
  const { setGraph } = useGraph();

  const handleConvert = (text: string) => {
    const { formattedInput, result } = text2matrix(text);

    try {
      validateMatrix(result);
      setGraph(result);
      return { formattedInput, result };
    } catch (e: any) {
      console.error(e);
      return { formattedInput: null, result: null };
    }
  };
  return { handleConvert };
};

export const GraphInputTextarea = ({
  value,
  setValue,
  onClick,
}: {
  value: string;
  setValue: (v: string) => void;
  onClick: (v: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="matrix">Nhập ma trận</Label>
        <Textarea
          id="matrix"
          className="min-h-72 resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value || "")}
        />
      </div>
      <Button onClick={() => onClick(value)}>Chuyển đổi</Button>
    </div>
  );
};

export const GraphInputFile = ({
  onFileChange,
}: {
  onFileChange: (v: string) => void;
}) => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "text/plain") {
      toast({
        title: "Lỗi",
        description: "File không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      onFileChange(content as string);
    };
    reader.readAsText(file);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept=".txt"
        onChange={handleFileChange}
      />
      <Button onClick={() => handleClick()}>Chọn file</Button>
    </div>
  );
};

export const GraphInput = () => {
  const [value, setValue] = useState<string>("");
  const { handleConvert } = useTextToGraph();

  const handleSetValue = (v: string) => {
    setValue(v);
  };

  const onConvert = (text: string) => {
    const { formattedInput } = handleConvert(text);

    if (formattedInput) {
      handleSetValue(formattedInput);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <GraphInputTextarea
        value={value}
        setValue={handleSetValue}
        onClick={onConvert}
      />
      <GraphInputFile onFileChange={onConvert} />
    </div>
  );
};
