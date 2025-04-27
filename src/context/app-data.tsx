import { createContext, useContext, useEffect, useState } from 'react';

import { User } from '@duabalabs/lib-parse';
import Parse from 'parse';

type AppDataType = {
  user: User;
};

const AppDataContext = createContext<AppDataType>({} as AppDataType);

export const AppDataProvider = ({ children }) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const getInitialData = async () => {
      const getUser = Parse.User.current<User>();
      setUser(getUser);
    };
    getInitialData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  return useContext(AppDataContext);
};
