import { useState } from "react";
import { cn } from "@/lib/utils";
import { ResizableHandle } from "@/components/ui/resizable";

const InteractiveResizableHandle: React.FC<{
  direction: "horizontal" | "vertical";
}> = ({ direction }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <ResizableHandle
      className={cn(
        "group flex flex-col align-center justify-center w-1.5 bg-transparent",
        direction === "vertical" && "w-full h-1.5"
      )}
      onDragging={setIsDragging}
    >
      <div
        className={cn(
          "w-0.5 h-6 group-hover:h-full bg-foreground group-hover:bg-blue-600 group-hover:dark:bg-blue-800 rounded-md opacity-20 group-hover:opacity-100",
          isDragging && "h-full bg-blue-600 dark:bg-blue-800 opacity-100",
          direction === "vertical" && "w-6 h-0.5",
          direction === "vertical" && isDragging && "w-full"
        )}
      />
    </ResizableHandle>
  );
};

export { InteractiveResizableHandle };
