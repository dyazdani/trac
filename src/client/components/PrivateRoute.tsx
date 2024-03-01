import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.js';


export function PrivateRoute({ children }: { children: React.ReactElement }) {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  

   if (currentUser) {
    return <Navigate to={'/goals'} />;
    // }
//   else if (loggedin==='loggedin'){
// // render the wrapped page
//     return children;
}
  else {
// user not logged in, redirect to the Login page which is unprotected
    return <Navigate to={'/'} />;
  }
}