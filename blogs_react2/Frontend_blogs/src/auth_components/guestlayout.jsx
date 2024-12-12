import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from "../contexts/ContextProvider";

export const GuestLayout = () => {

  const { userToken } = useStateContext();

  // Redirect to homepage if the user is already authenticated
  if (userToken) {
    return <Navigate to="/" />;
  }

  return (

      <>
        <Outlet />
        </>
  );
};

export default GuestLayout;
