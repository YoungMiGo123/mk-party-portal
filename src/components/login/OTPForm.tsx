import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface OTPFormProps {
  onBack: () => void;
  onResendOTP: () => void;
  onSubmit: (otp: string) => void;
  blockCount?: number;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export default function OTPForm({
  onBack,
  onSubmit,
  onResendOTP,
  blockCount = 4,
  isLoading = false,
  title = "Enter Verification Code",
  description = "We've sent a code to your device. Please enter it below.",
}: OTPFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(blockCount).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, blockCount);
    setOtp(Array(blockCount).fill(""));
  }, [blockCount]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < blockCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < blockCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData
      .replace(/\D/g, "")
      .split("")
      .slice(0, blockCount);

    const newOtp = [...otp];
    pastedDigits.forEach((digit, index) => {
      if (index < blockCount) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[blockCount - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      setError("Please enter all digits");
      return;
    }

    const otpString = otp.join("");
    onSubmit(otpString);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-neutral-200">
      <CardHeader className="relative p-6 pb-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-4 top-4 h-8 w-8"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="text-center pt-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: blockCount }).map((_, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg font-medium"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.some((digit) => !digit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>

          <div className="text-center mt-4">
            <Button
              variant="link"
              type="button"
              className="text-sm"
              onClick={onResendOTP}
            >
              Didn't receive a code? Resend
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
