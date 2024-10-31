import { Checkbox, Label } from "@/components/ui";
import useResultOnly from "@/app/hooks/useResultOnly";

export interface ResultOnlyCheckboxProps {
  label: string;
  containerClassName: string;
}

export default function ResultOnlyCheckbox({
  label,
  containerClassName,
}: ResultOnlyCheckboxProps) {
  const { resultOnly, toggleResultOnly } = useResultOnly();
  return (
    <div className={containerClassName}>
      <Label htmlFor="only-result">{label}</Label>
      <Checkbox
        id="only-result"
        checked={resultOnly}
        onClick={toggleResultOnly}
      />
    </div>
  );
}
