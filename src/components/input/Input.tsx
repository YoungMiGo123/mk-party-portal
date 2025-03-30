import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input as BaseInput } from "@/components/ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  error: string;
}

export default function Input(props: InputProps) {
  const { name, label, placeholder, value, error } = props;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-mkneutral-700 font-medium">
        {label} <span className="text-red-500">*</span>
      </Label>
      <BaseInput
        id={name}
        name={name}
        value={value}
        className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
          error ? "border-red-500 ring-1 ring-red-500" : ""
        }`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="form-error flex items-center text-xs">
          <AlertCircle size={12} className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
}
