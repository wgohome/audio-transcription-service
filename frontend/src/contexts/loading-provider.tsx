import { ReactNode, useState } from "react";
import { LoadingContext } from "./loading-context";

interface ILoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: ILoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoadingSpinner = () => {
    setIsLoading(true);
  };

  const stopLoadingSpinner = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoadingSpinner,
        stopLoadingSpinner,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
