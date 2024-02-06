import { useCallback } from "react";
import copy from "copy-to-clipboard";
import { Bot, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { MESSAGE_TYPES, Message } from "@/lib/api/ask-question";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Citation } from "@/components/app/citation";

function ChatMessage({
  message,
}: {
  message: Omit<Message["message"], "confidence_score">;
}) {
  const { toast } = useToast();
  const lines = message.text.split("\n");

  const copyToClipboard = useCallback(() => {
    copy(message.text);
    toast({
      description: "Copied to clipboard",
    });
  }, [toast, message]);

  let citationNumber = 1;

  return (
    <div
      className={cn(
        "flex gap-4",
        message.type === MESSAGE_TYPES.BOT ? "pb-4" : ""
      )}
    >
      {message.type === MESSAGE_TYPES.USER ? (
        <Avatar className="w-7 h-7">
          <AvatarImage
            src="https://www.zeldadungeon.net/images/news/screenshot_36843.jpg"
            alt="@manuelaljibesrosas"
          />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-7 h-7">
          <Bot size={28} className="stroke-foreground" />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Card
          className={cn(
            "p-4 py-3.5 rounded-tl-sm bg-border shadow bg-gradient-to-tl to-[hsl(var(--muted))] from-[hsl(var(--border))] to-50%",
            message.type === MESSAGE_TYPES.ERROR &&
              "to-[hsl(var(--destructive))] from-[hsl(var(--destructive))]"
          )}
        >
          {lines
            .filter((line) => line.length > 0)
            .map((line, index) => (
              <span key={index}>
                {line.split(/\[(\d+)\]/g).map((text, chunkIndex) => {
                  if (chunkIndex % 2 === 0) return text;

                  return (
                    <Citation
                      key={chunkIndex}
                      citation={message.citations[chunkIndex - 1]}
                      citationNumber={citationNumber++}
                    />
                  );
                })}
                <br />
              </span>
            ))}
        </Card>
        {message.type === MESSAGE_TYPES.BOT && (
          <div className="flex justify-end items-center gap-1.5">
            <ToggleGroup type="single">
              <Tooltip>
                <TooltipTrigger>
                  <ToggleGroupItem
                    value="like"
                    aria-label="Good response"
                    className="h-7 w-7 px-0 data-[state=on]:stroke-foreground data-[state=off]:stroke-muted-foreground"
                  >
                    <ThumbsUp size={16} className="stroke-inherit" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Good response</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <ToggleGroupItem
                    value="dislike"
                    aria-label="Bad response"
                    className="h-7 w-7 px-0 data-[state=on]:stroke-foreground data-[state=off]:stroke-muted-foreground"
                  >
                    <ThumbsDown size={16} className="stroke-inherit" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Good response</TooltipContent>
              </Tooltip>
            </ToggleGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="h-7 w-7 px-0"
            >
              <Copy size={16} className="stroke-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { ChatMessage };
