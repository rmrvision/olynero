"use client"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  direction = "horizontal",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { direction?: "horizontal" | "vertical" }) => (
  <div
    className={cn(
      "flex h-full w-full",
      direction === "vertical" ? "flex-col" : "flex-row",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ({
  className,
  defaultSize,
  minSize,
  maxSize,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { defaultSize?: number, minSize?: number, maxSize?: number }) => (
  <div
    className={cn(
      "flex-1 overflow-hidden relative",
      className
    )}
    style={{ flexBasis: defaultSize ? `${defaultSize}%` : undefined }}
    {...props}
  />
)

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean
}) => (
  <div
    className={cn(
      "relative flex w-px items-center justify-center bg-zinc-200 dark:bg-zinc-800",
      className
    )}
    {...props}
  >
  </div>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
