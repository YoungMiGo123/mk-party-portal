import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface PopupDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * The title of the dialog
   */
  title: string;
  /**
   * The main content of the dialog
   */
  content: React.ReactNode;
  /**
   * Function to call when the dialog is closed
   */
  onClose: () => void;
  /**
   * Optional description text that appears below the title
   */
  description?: string;
  /**
   * Optional custom footer content
   */
  footer?: React.ReactNode;
  /**
   * Width of the dialog. Default is "md" (medium)
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * Label for the close button
   */
  closeButtonLabel?: string;
  /**
   * Whether to show the close button in the corner
   */
  showCloseIcon?: boolean;
  /**
   * Optional icon to display next to the title
   */
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  full: "sm:max-w-screen-lg",
};

/**
 * A reusable dialog component for various popup needs
 */
export function PopupDialog({
  open,
  title,
  content,
  onClose,
  description,
  footer,
  size = "md",
  closeButtonLabel = "Close",
  showCloseIcon = true,
  icon,
}: PopupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={`${sizeClasses[size]}`}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div className="flex-grow">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">{content}</div>

        <DialogFooter>
          {footer || (
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>
                {closeButtonLabel}
              </Button>
            </DialogClose>
          )}
        </DialogFooter>

        {showCloseIcon && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
}
