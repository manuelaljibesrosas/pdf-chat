import { useCallback, useContext } from "react";
import {
  Columns2,
  CreditCard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelRightClose,
  Settings2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useResponsive } from "@/components/ui/use-responsive";
import { ImperativePanelGroupHandleContext } from "@/app";

function Header() {
  const imperativePanelGroupHandle = useContext(
    ImperativePanelGroupHandleContext
  );
  const { isMobile } = useResponsive();

  const updateLayout = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (imperativePanelGroupHandle === null) return;

      imperativePanelGroupHandle.setLayout(
        (e.currentTarget.dataset.value as string).split(",").map(Number) as [
          number,
          number
        ]
      );
    },
    [imperativePanelGroupHandle]
  );

  return (
    <div className="flex justify-between items-center h-14 w-full px-2">
      <div className="flex flex-1 justify-start items-center gap-1.5">
        <Button variant="outline" size="icon">
          <Menu size={20} />
        </Button>
        <ModeToggle />
      </div>
      {!isMobile && (
        <div className="flex flex-1 justify-center items-center gap-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Hide document panel"
                  className="h-7 w-7 px-0"
                  data-value={[0, 100].join(",")}
                  onClick={updateLayout}
                >
                  <PanelLeftClose
                    size={16}
                    className="stroke-muted-foreground"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collapse document panel</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Evenly space both panels"
                  className="h-7 w-7 px-0"
                  data-value={[50, 50].join(",")}
                  onClick={updateLayout}
                >
                  <Columns2 size={16} className="stroke-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute panels evenly</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Hide chat panel"
                  className="h-7 w-7 px-0"
                  data-value={[100, 0].join(",")}
                  onClick={updateLayout}
                >
                  <PanelRightClose
                    size={16}
                    className="stroke-muted-foreground"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collapse chat panel</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
      <div className="flex flex-1 justify-end items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="w-7 h-7">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>@manuelaljibesrosas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="justify-between">
                <span>Profile</span>
                <User className="w-4 h-4 opacity-60" />
              </DropdownMenuItem>
              <DropdownMenuItem className="justify-between">
                <span>Billing</span>
                <CreditCard className="w-4 h-4 opacity-60" />
              </DropdownMenuItem>
              <DropdownMenuItem className="justify-between">
                <span>Settings</span>
                <Settings2 className="w-4 h-4 opacity-60" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-between">
              <span>Log out</span>
              <LogOut className="w-4 h-4 opacity-60" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export { Header };
