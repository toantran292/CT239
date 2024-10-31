import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import useMatrixInput from "@/app/hooks/useMatrixInput";
import { Label } from "@/components/ui/label";

export interface MatrixInputProps {
  label: string;
  containerClassName: string;
}

export default function MatrixInput({
  containerClassName,
  label,
}: MatrixInputProps) {
  const { value, error, setValue, onBlur } = useMatrixInput();
  return (
    <div className={containerClassName}>
      <Label htmlFor="matrix">{label}</Label>
      <Textarea
        id="matrix"
        className={cn("w-full h-36 resize-none", error && "border-red-500")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onBlur()}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
