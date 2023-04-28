import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const logIn = () => {
    setEmail(email);
    setLogin(login);
    setPassword(password);
    console.log('login', login, 'email', email, 'password', password);

    setIsAuth(true);
  };

  const logOut = () => {
    setEmail('');
    setLogin('');
    setPassword('');
    setIsAuth(false);
  };

  return (
    <UserContext.Provider
      value={{
        login,
        email,
        password,
        isAuth,
        setIsAuth,
        setLogin,
        setEmail,
        logIn,
        setPassword,
        logOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
