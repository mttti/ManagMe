import { createContext, useEffect, useReducer } from "react";

interface AuthState {
  user: any;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT";
  payload?: any;
}

export const AuthContext = createContext<any>(undefined);

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };

    default:
      return state;
  }
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem("user")!) ?? null,
  });

  useEffect(() => {
    const localStorageData = localStorage.getItem("user");
    if (localStorageData) {
      const user = JSON.parse(localStorage.getItem("user")!);
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
