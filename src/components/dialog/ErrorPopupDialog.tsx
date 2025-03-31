import React from "react";
import { XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopupDialog, PopupDialogProps } from "@/components/dialog/PopupDialog";

export interface ErrorPopupDialogProps
  extends Omit<PopupDialogProps, "title" | "content" | "icon"> {
  /**
   * Error message to display
   */
  message: string;
  /**
   * Optional error title (defaults to "Error")
   */
  title?: string;
  /**
   * Optional additional content to display after the message
   */
  additionalContent?: React.ReactNode;
  /**
   * Optional action button label (defaults to "Try Again")
   */
  actionLabel?: string;
  /**
   * Optional action handler
   */
  onAction?: () => void;
  /**
   * Whether to show the error icon (defaults to true)
   */
  showIcon?: boolean;
}

/**
 * A specialized popup dialog for error messages
 */
export function ErrorPopupDialog({
  message,
  title = "Error",
  additionalContent,
  actionLabel = "Try Again",
  onAction,
  size = "md",
  showCloseIcon = true,
  closeButtonLabel = "Close",
  showIcon = true,
  ...props
}: ErrorPopupDialogProps) {
  const errorContent = (
    <div className="flex flex-col space-y-4">
      {message && <p className="text-lg">{message}</p>}
      {additionalContent && <div className="w-full">{additionalContent}</div>}
    </div>
  );

  const errorFooter = onAction ? (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={props.onClose}>
        {closeButtonLabel}
      </Button>
      <Button onClick={onAction}>{actionLabel}</Button>
    </div>
  ) : undefined;

  const icon = showIcon ? (
    <XOctagon className="h-6 w-6 text-destructive" />
  ) : undefined;

  return (
    <PopupDialog
      title={title}
      content={errorContent}
      size={size}
      showCloseIcon={showCloseIcon}
      closeButtonLabel={closeButtonLabel}
      footer={errorFooter}
      icon={icon}
      {...props}
    />
  );
}
