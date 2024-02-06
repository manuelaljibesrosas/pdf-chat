import { createContext, useContext } from "react";
import { ChevronDown, ChevronUp, Expand, ZoomIn, ZoomOut } from "lucide-react";
import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import {
  DefaultLayoutPlugin,
  ToolbarSlot,
  defaultLayoutPlugin,
} from "@react-pdf-viewer/default-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useTheme } from "@/components/ui/theme-provider";

const specialZoomLevelLabels = {
  [SpecialZoomLevel.ActualSize]: "Actual size",
  [SpecialZoomLevel.PageFit]: "Page fit",
  [SpecialZoomLevel.PageWidth]: "Page width",
};

export const DefaultLayoutPluginContext =
  createContext<DefaultLayoutPlugin>(null!);

export const DefaultLayoutPluginContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {({
          GoToPreviousPage,
          CurrentPageInput,
          GoToNextPage,
          ZoomOut: ZoomOutComponent,
          ZoomIn: ZoomInComponent,
          Zoom,
          EnterFullScreen,
        }: ToolbarSlot) => (
          <div className="flex justify-between items-center w-full h-full px-1.5 bg-background">
            <div className="flex flex-1 gap-1.5 justify-start items-center">
              <Tooltip>
                <TooltipTrigger>
                  <GoToPreviousPage>
                    {(props) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        {...props}
                      >
                        <ChevronUp
                          size={16}
                          className="stroke-muted-foreground"
                        />
                      </Button>
                    )}
                  </GoToPreviousPage>
                </TooltipTrigger>
                <TooltipContent>Previous page</TooltipContent>
              </Tooltip>
              <CurrentPageInput />
              <Tooltip>
                <TooltipTrigger>
                  <GoToNextPage>
                    {(props) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        {...props}
                      >
                        <ChevronDown
                          size={16}
                          className="stroke-muted-foreground"
                        />
                      </Button>
                    )}
                  </GoToNextPage>
                </TooltipTrigger>
                <TooltipContent>Next page</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-1 gap-1.5 justify-center items-center">
              <Tooltip>
                <TooltipTrigger>
                  <ZoomOutComponent>
                    {(props) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        {...props}
                      >
                        <ZoomOut
                          size={16}
                          className="stroke-muted-foreground"
                        />
                      </Button>
                    )}
                  </ZoomOutComponent>
                </TooltipTrigger>
                <TooltipContent>Zoom out</TooltipContent>
              </Tooltip>
              <Zoom>
                {({ scale, onZoom }) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">{`${Math.round(
                        scale * 100
                      )}%`}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuGroup>
                        {Object.keys(SpecialZoomLevel).map((level) => (
                          <DropdownMenuItem
                            key={level}
                            onClick={() => onZoom(level as SpecialZoomLevel)}
                          >
                            {specialZoomLevelLabels[level as SpecialZoomLevel]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4].map((level) => (
                          <DropdownMenuItem
                            key={level}
                            onClick={() => onZoom(level)}
                          >{`${level * 100}%`}</DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Zoom>
              <Tooltip>
                <TooltipTrigger>
                  <ZoomInComponent>
                    {(props) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        {...props}
                      >
                        <ZoomIn size={16} className="stroke-muted-foreground" />
                      </Button>
                    )}
                  </ZoomInComponent>
                </TooltipTrigger>
                <TooltipContent>Zoom in</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-1 gap-1.5 justify-end items-center">
              <Tooltip>
                <TooltipTrigger>
                  <EnterFullScreen>
                    {(props) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        {...props}
                      >
                        <Expand size={16} className="stroke-muted-foreground" />
                      </Button>
                    )}
                  </EnterFullScreen>
                </TooltipTrigger>
                <TooltipContent>Full screen</TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </Toolbar>
    ),
  });

  return (
    <DefaultLayoutPluginContext.Provider value={defaultLayoutPluginInstance}>
      {children}
    </DefaultLayoutPluginContext.Provider>
  );
};

export const PdfViewer: React.FC = () => {
  const defaultLayoutPluginInstance = useContext(DefaultLayoutPluginContext);
  const { theme } = useTheme();

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer
        plugins={[defaultLayoutPluginInstance]}
        fileUrl="hiscox_gl_fe_challenge.pdf"
        theme={theme}
      />
    </Worker>
  );
};
