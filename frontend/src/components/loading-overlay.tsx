import { LoadingContext } from "@/contexts/loading-context";
import { cn } from "@/lib/utils";
import { type ReactNode, useContext } from "react";

interface ILoadingOverlayProps {
  children: ReactNode;
}

export default function LoadingOverlay({ children }: ILoadingOverlayProps) {
  const { isLoading } = useContext(LoadingContext);

  return (
    <>
      {children}
      {isLoading && (
        <div className={cn("fixed inset-0 flex items-center justify-center bg-black/50")}>
          <div className="flex flex-col">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900"></div>
          </div>
        </div>
      )}
    </>
  );
}
