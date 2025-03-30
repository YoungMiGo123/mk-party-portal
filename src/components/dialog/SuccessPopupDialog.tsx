import React from "react";
import { CheckCircle } from "lucide-react";
import { PopupDialog, PopupDialogProps } from "@/components/dialog/PopupDialog";

export interface SuccessPopupDialogProps
  extends Omit<PopupDialogProps, "title" | "content" | "icon"> {
  /**
   * Success message to display
   */
  message: string;
  /**
   * Optional success title (defaults to "Success!")
   */
  title?: string;
  /**
   * Optional additional content to display after the message
   */
  additionalContent?: React.ReactNode;
  /**
   * Whether to show the success icon (defaults to true)
   */
  showIcon?: boolean;
}

/**
 * A specialized popup dialog for success messages
 */
export function SuccessPopupDialog({
  message,
  title = "Success!",
  additionalContent,
  size = "md",
  showCloseIcon = true,
  closeButtonLabel = "Close",
  showIcon = true,
  ...props
}: SuccessPopupDialogProps) {
  const successContent = (
    <div className="flex flex-col space-y-4">
      <p className="text-lg">{message}</p>
      {additionalContent && <div className="w-full">{additionalContent}</div>}
    </div>
  );

  const icon = showIcon ? (
    <CheckCircle className="h-6 w-6 text-green-500" />
  ) : undefined;

  return (
    <PopupDialog
      title={title}
      content={successContent}
      size={size}
      showCloseIcon={showCloseIcon}
      closeButtonLabel={closeButtonLabel}
      icon={icon}
      {...props}
    />
  );
}
