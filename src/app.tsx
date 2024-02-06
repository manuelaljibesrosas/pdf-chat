import { createContext, useState } from "react";
import { ImperativePanelGroupHandle } from "react-resizable-panels";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Card } from "@/components/ui/card";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useResponsive } from "@/components/ui/use-responsive";
import { ChatBox } from "@/components/app/chat-box";
import { Header } from "@/components/app/header";
import { InteractiveResizableHandle } from "@/components/app/interactive-resizable-handle";
import {
  DefaultLayoutPluginContextProvider,
  PdfViewer,
} from "./components/app/pdf-viewer";

export const ImperativePanelGroupHandleContext =
  createContext<ImperativePanelGroupHandle | null>(null);

function App() {
  const [imperativePanelGroupHandle, setImperativePanelGroupHandle] =
    useState<ImperativePanelGroupHandle | null>(null);

  const { isMobile } = useResponsive();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="chatbot-ui-theme">
      <ImperativePanelGroupHandleContext.Provider
        value={imperativePanelGroupHandle}
      >
        <DefaultLayoutPluginContextProvider>
          <TooltipProvider>
            <main className="flex flex-col w-screen h-screen h-svh bg-muted bg-gradient-to-tl to-[hsl(var(--background))] from-[hsl(var(--border))] from-35%">
              <Header />
              <ResizablePanelGroup
                ref={setImperativePanelGroupHandle}
                direction={isMobile ? "vertical" : "horizontal"}
                className="p-2 pt-0"
              >
                <ResizablePanel minSize={100 / 4}>
                  <Card className="overflow-auto h-full">
                    <PdfViewer />
                  </Card>
                </ResizablePanel>
                <InteractiveResizableHandle
                  direction={isMobile ? "vertical" : "horizontal"}
                />
                <ResizablePanel minSize={100 / 4}>
                  <ChatBox />
                </ResizablePanel>
              </ResizablePanelGroup>
            </main>
            <Toaster />
          </TooltipProvider>
        </DefaultLayoutPluginContextProvider>
      </ImperativePanelGroupHandleContext.Provider>
    </ThemeProvider>
  );
}

export default App;
