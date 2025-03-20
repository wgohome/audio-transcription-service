import { createContext } from "react";

interface LoadingContextProps {
  isLoading: boolean;
  startLoadingSpinner: () => void;
  stopLoadingSpinner: () => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  startLoadingSpinner: () => {},
  stopLoadingSpinner: () => {},
});
