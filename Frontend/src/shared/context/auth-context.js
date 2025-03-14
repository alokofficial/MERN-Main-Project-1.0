import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    userId: null
});


export default AuthContext;