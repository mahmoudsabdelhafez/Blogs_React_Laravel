import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";


const StateContext = createContext({
    currentUser: {},
    userToken: null,
    setCurrentUser: () => {},
    setUserToken: () => {},
});







export const  ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem('USER_ID') || null,
    name: "",
    email: "",
  });

  const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  
  
  const setCurrentUserData = (user) => {
    setCurrentUser(user);
    if (user?.id) {
      localStorage.setItem('USER_ID', user.id); // Save user id in localStorage
    } else {
      localStorage.removeItem('USER_ID'); // Clear user id if no user
    }
  };
   
    const setUserToken = (token) => {
      if (token) {
    
        localStorage.setItem('TOKEN', token)
      } else {
        localStorage.removeItem('TOKEN')
      }
      _setUserToken(token); // React’s state update function through the all app
    }

    return (
      <StateContext.Provider
        value={{
          currentUser,
          setCurrentUser: setCurrentUserData,
          userToken,
          setUserToken,

        }}
      >
        {children}
      </StateContext.Provider>
    );
  };
  
  export const useStateContext = () => useContext(StateContext);