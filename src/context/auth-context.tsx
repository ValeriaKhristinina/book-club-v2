import {
  createContext,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  useContext,
  useState
} from "react";

interface AuthContextType {
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  setIsAuth: () => null
});

const AuthContextProvider = ({ children }: { children: ReactElement }) => {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
