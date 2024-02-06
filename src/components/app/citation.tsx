import { useCallback, useContext } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DefaultLayoutPluginContext } from "@/components/app/pdf-viewer";

function Citation({
  citation,
  citationNumber,
}: {
  citation: string;
  citationNumber: number;
}) {
  const defaultLayoutPluginInstance = useContext(DefaultLayoutPluginContext);

  const markdownUrlRegex = /\[([^[\]]*)]\(([^[\]]*)\)/g;
  const message = citation.replace(markdownUrlRegex, "");
  const lines = message.split("\n");

  const pageNumberRegex = /page:(\d+)/;
  const pageNumberMatch = citation.match(pageNumberRegex);
  const page = pageNumberMatch !== null ? pageNumberMatch[1] : -1;

  const openPage = useCallback(() => {
    defaultLayoutPluginInstance.toolbarPluginInstance.pageNavigationPluginInstance.jumpToPage(
      Number(page) - 1
    );
  }, [
    defaultLayoutPluginInstance.toolbarPluginInstance
      .pageNavigationPluginInstance,
    page,
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer -translate-y-1 inline-flex justify-center items-center w-4 h-4 text-white text-[0.6rem] leading-none font-medium rounded-full bg-blue-600 dark:bg-blue-800">
          {String(citationNumber)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col items-start gap-2.5 w-80">
        <ScrollArea type="always">
          <blockquote className="flex flex-col gap-2.5 max-h-60 text-sm italic">
            {lines
              .filter((line) => line.length > 0)
              .map((line, index) => (
                <div key={index}>{line}</div>
              ))}
          </blockquote>
        </ScrollArea>
        <Button variant="outline" size="sm" onClick={openPage}>
          Open page
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export { Citation };
