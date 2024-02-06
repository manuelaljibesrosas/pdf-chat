import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Bot, Image, RotateCw, Send, Wand2 } from "lucide-react";
import { MESSAGE_TYPES, Message, fetchResponse } from "@/lib/api/ask-question";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { Form, FormField } from "@/components/ui/form";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { ChatMessage } from "@/components/app/chat-message";

const _suggestions = [
  "What types of liabilities are covered under the Hiscox GL product?",
  "Are there specific exclusions or limitations to the coverage provided by the Hiscox GL product?",
  "How are premiums determined for the Hiscox GL product?",
  "Can the policy be customized to suit the specific needs of a business?",
  "What is the process for filing a claim under the Hiscox GL product?",
  "Are there any discounts available for purchasing multiple insurance products from Hiscox?",
  "What are the policy limits and deductibles for the Hiscox GL product?",
  "Does the Hiscox GL policy provide coverage for legal expenses in the event of a lawsuit?",
  "Are there any additional benefits or services included with the Hiscox GL product?",
  "How does the Hiscox GL product compare to other commercial insurance products in the market?",
];

const formSchema = z.object({
  message: z.string().min(1).max(1000),
});

function ChatBox() {
  const scrollable = useRef<HTMLDivElement>(null!);
  const [messages, setMessages] = useState<
    Omit<Message["message"], "confidence_score">[]
  >([]);
  const [isAnimatingResponse, setIsAnimatingResponse] = useState(false);
  const [suggestions, setSuggestions] = useState(_suggestions.slice(0, 3));
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const animateMessage = useCallback(
    async (message: Omit<Message["message"], "confidence_score">) => {
      setIsAnimatingResponse(true);
      const index = messages.length + 1;
      let newMessage = "";

      const promises = message.text.split(" ").map((word) => {
        const _newMessage = (newMessage = `${newMessage} ${word}`);

        return async () => {
          await new Promise<void>((resolve) =>
            setTimeout(() => {
              resolve();
              setMessages((oldMessages) => {
                const ret = oldMessages.concat([]);
                ret[index] = {
                  type: message.type,
                  text: _newMessage,
                  citations: message.citations,
                };

                return ret;
              });
            }, Math.round(Math.random() * 100))
          );
        };
      });

      for (const promise of promises) {
        await promise();
      }
      setIsAnimatingResponse(false);
    },
    [messages.length]
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      form.resetField("message");

      setTimeout(
        () =>
          scrollable.current
            .querySelector("[data-radix-scroll-area-viewport]")
            ?.scrollTo(0, 99999),
        200
      );

      setMessages((messages) =>
        messages.concat([
          { type: MESSAGE_TYPES.USER, text: values.message, citations: [] },
        ])
      );

      const response = await fetchResponse(values.message);

      animateMessage(response);
    },
    [animateMessage, form]
  );

  return (
    <Card className="h-full">
      <div className="relative h-full flex flex-col flex-1">
        <ScrollArea type="always" className="flex-1" ref={scrollable}>
          <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-[calc(100%-60px)] max-w-3xl py-12">
              {messages.map((message, i) => (
                <ChatMessage key={`chat-message-${i}`} message={message} />
              ))}
              {form.formState.isSubmitting && (
                <div className="flex gap-4 pb-4">
                  <div className="w-7 h-7">
                    <Bot size={28} className="stroke-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Card className="flex items-center gap-1 h-[52px] p-4 py-3.5 rounded-tl-sm bg-border shadow bg-gradient-to-tl to-[hsl(var(--muted))] from-[hsl(var(--border))] to-50%">
                      <div className="animate-typing-animation delay-200 w-[7px] h-[7px] rounded-full bg-muted-foreground" />
                      <div className="animate-typing-animation delay-300 w-[7px] h-[7px] rounded-full bg-muted-foreground" />
                      <div className="animate-typing-animation delay-400 w-[7px] h-[7px] rounded-full bg-muted-foreground" />
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <Popover>
          <PopoverAnchor>
            <div className="relative flex items-center gap-2.5 p-6 border-t-2">
              <PopoverContent asChild side="top" align="start" alignOffset={4}>
                <Card className="flex flex-col gap-2.5 w-[512px] max-w-[calc(100vw-24px)] p-4 rounded-bl-sm bg-border shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3>Don't know what to ask? Try these:</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => {
                        const indexes: number[] = [];

                        for (let i = 0; i < 3; i++) {
                          let index = Math.round(
                            Math.random() * (_suggestions.length - 4)
                          );

                          while (indexes.includes(index)) {
                            index = Math.round(
                              Math.random() * (_suggestions.length - 4)
                            );
                          }

                          indexes.push(index);
                        }

                        setSuggestions(
                          indexes.map((index) => _suggestions[index])
                        );
                      }}
                    >
                      <RotateCw size={16} className="text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((message, i) => (
                      <PopoverClose asChild>
                        <Card
                          className={cn(
                            "fill-mode-both animate-in duration-500 fade-in-0 slide-in-from-bottom ease-out cursor-pointer px-4 py-2.5 text-sm",
                            i === 1 && "delay-100",
                            i === 2 && "delay-200"
                          )}
                          onClick={() => {
                            form.setValue("message", message);
                            form.handleSubmit(onSubmit)();
                          }}
                        >
                          {message}
                        </Card>
                      </PopoverClose>
                    ))}
                  </div>
                </Card>
              </PopoverContent>
              <PopoverTrigger>
                <Button variant="ghost" size="icon">
                  <Wand2 size={18} />
                </Button>
              </PopoverTrigger>
              <Button variant="ghost" size="icon">
                <Image size={18} />
              </Button>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative w-full"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <Input
                        className="h-12"
                        placeholder="Enter a prompt here"
                        {...field}
                      />
                    )}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="-translate-y-1/2 absolute top-1/2 right-2"
                    disabled={
                      isAnimatingResponse ||
                      !form.formState.isValid ||
                      form.formState.isSubmitting
                    }
                  >
                    <Send
                      size={18}
                      className={cn(
                        "transition-all opacity-100",
                        (isAnimatingResponse ||
                          !form.formState.isValid ||
                          form.formState.isSubmitting) &&
                          "opacity-25"
                      )}
                    />
                  </Button>
                </form>
              </Form>
            </div>
          </PopoverAnchor>
        </Popover>
      </div>
    </Card>
  );
}

export { ChatBox };
