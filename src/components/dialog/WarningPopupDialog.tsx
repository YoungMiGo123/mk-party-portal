import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopupDialog, PopupDialogProps } from "@/components/dialog/PopupDialog";

export interface WarningPopupDialogProps
  extends Omit<PopupDialogProps, "title" | "content" | "icon"> {
  /**
   * Warning message to display
   */
  message: string;
  /**
   * Optional warning title (defaults to "Warning")
   */
  title?: string;
  /**
   * Optional additional content to display after the message
   */
  additionalContent?: React.ReactNode;
  /**
   * Optional confirm button label (defaults to "Proceed")
   */
  confirmLabel?: string;
  /**
   * Optional confirm handler
   */
  onConfirm?: () => void;
  /**
   * Optional cancel button label (defaults to "Cancel")
   */
  cancelLabel?: string;
  /**
   * Whether to show the warning icon (defaults to true)
   */
  showIcon?: boolean;
}

/**
 * A specialized popup dialog for warning messages
 */
export function WarningPopupDialog({
  message,
  title = "Warning",
  additionalContent,
  confirmLabel = "Proceed",
  onConfirm,
  cancelLabel = "Cancel",
  size = "md",
  showCloseIcon = true,
  showIcon = true,
  ...props
}: WarningPopupDialogProps) {
  const warningContent = (
    <div className="flex flex-col space-y-4">
      <p className="text-lg">{message}</p>
      {additionalContent && <div className="w-full">{additionalContent}</div>}
    </div>
  );

  const warningFooter = onConfirm ? (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={props.onClose}>
        {cancelLabel}
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          onConfirm();
          props.onClose();
        }}
      >
        {confirmLabel}
      </Button>
    </div>
  ) : undefined;

  const icon = showIcon ? (
    <AlertTriangle className="h-6 w-6 text-amber-500" />
  ) : undefined;

  return (
    <PopupDialog
      title={title}
      content={warningContent}
      size={size}
      showCloseIcon={showCloseIcon}
      closeButtonLabel={cancelLabel}
      footer={warningFooter}
      icon={icon}
      {...props}
    />
  );
}
