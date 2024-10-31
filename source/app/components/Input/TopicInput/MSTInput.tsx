import MatrixInput from "../MatrixInput";
import useMatrixInput from "@/app/hooks/useMatrixInput";
import { useEffect } from "react";
import { isDirectedMatrix } from "@/lib/utils";
import ResultOnlyCheckbox from "@/app/components/Checkbox/ResultOnlyCheckbox";

export default function MSTInput() {
  const { matrix, onValidateError } = useMatrixInput();

  useEffect(() => {
    if (isDirectedMatrix(matrix))
      onValidateError({
        message: "Cây khung tối tiểu hiện tại không hỗ trợ đồ thị có hướng",
      });
  }, [matrix, onValidateError]);

  return (
    <div className="w-full">
      <MatrixInput
        containerClassName="grid w-full items-center gap-1.5 mb-3"
        label="Ma Trận (N, M <= 10)"
      />
      <ResultOnlyCheckbox
        label="Chỉ hiện đường kết quả"
        containerClassName="grid w-full items-center gap-1.5 mb-3"
      />
    </div>
  );
}
