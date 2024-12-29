"use client";

import { AuthService } from "@/api/auth.service";
import useRealTimeLocalStorage from "@/hooks/useRealTimeLocalstorage";
import { createContext, useContext } from "react";
import useSwr from "swr";

interface IInitialState {
  auth: any;
  token: string | null;
}

const INITIAL_STATE: IInitialState = {
  auth: null,
  token: "",
};

interface IContext {
  state: IInitialState;
  setState: (newValue: IInitialState) => void;
  AUTHENTICATE: (token: string) => void;
  LOGOUT: () => void;
}
const MachineContext = createContext<IContext | null>(null);

interface IMachineProps {
  children: React.ReactNode;
}
export function Machine({ children }: IMachineProps) {
  const [state, setState] = useRealTimeLocalStorage<IInitialState>(
    "news-app",
    INITIAL_STATE
  );

  useSwr("current-user", async () => {
    const { user: CURRENT_USER } = await AuthService.getCurrentUser();
    setState({ ...state, auth: CURRENT_USER });
  });

  function AUTHENTICATE(token: string, auth?: any) {
    setState({
      ...state,
      token,
      auth: auth,
    });
  }

  function LOGOUT() {
    setState({
      ...state,
      auth: null,
      token: null,
    });
  }

  return (
    <MachineContext.Provider value={{ state, setState, AUTHENTICATE, LOGOUT }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachine() {
  const ctx = useContext(MachineContext);
  if (!ctx) throw new Error("Machine can't be used outside of its context");
  return ctx;
}
