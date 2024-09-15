
import {
  useContext,
  useState,
  createContext,
  ReactNode,
} from "react";

const RefreshEventsContext = createContext<{
  newEventLoading : boolean;
  setNewEventLoading : React.Dispatch<React.SetStateAction<boolean>>;
  savedEventLoading : boolean;
  setSavedEventLoading : React.Dispatch<React.SetStateAction<boolean>>;
}>({
  newEventLoading : false,
  setNewEventLoading : ()=>{},
  savedEventLoading : false,
  setSavedEventLoading : ()=>{}
});

interface RefreshEventsProps {
  children: ReactNode;
}

export const RefreshEvents = ({ children }: RefreshEventsProps) => {
  const [newEventLoading, setNewEventLoading] = useState<boolean>(false);
  const [savedEventLoading, setSavedEventLoading] = useState<boolean>(false);
  const value = {
    newEventLoading,
    setNewEventLoading,
    savedEventLoading,
    setSavedEventLoading
  };


  return (
    <RefreshEventsContext.Provider value={value}>
      {children}
    </RefreshEventsContext.Provider>
  );
};


export const useRefreshEvents = () => {
  return useContext(RefreshEventsContext);
};