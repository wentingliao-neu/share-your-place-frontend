import "./App.css";
import React, { Suspense } from "react";
import {
   BrowserRouter as Router,
   Route,
   Redirect,
   Switch,
} from "react-router-dom";
import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
// import Auth from "./User/Pages/Auth";
// import Users from "./User/Pages/Users";
// import NewPlace from "./Places/Pages/NewPlace";
// import UserPlaces from "./Places/Pages/UserPlaces";
// import UpdatePlace from "./Places/Pages/UpdatePlace";
import { AuthContext } from "./Shared/context/auth-context";
import { useAuth } from "./Shared/hooks/auth-hook";
import LoadingSpinner from "./Shared/Components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./User/Pages/Users"));
const NewPlace = React.lazy(() => import("./Places/Pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./Places/Pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./Places/Pages/UpdatePlace"));
const Auth = React.lazy(() => import("./User/Pages/Auth"));

function App() {
   const { token, login, logout, userId } = useAuth();
   let routes = token ? (
      <Switch>
         <Route path="/" exact>
            <Users />
         </Route>
         <Route path="/:userId/places">
            <UserPlaces />
         </Route>
         <Route path="/places/new" exact>
            <NewPlace />
         </Route>
         <Route path="/places/:placeId">
            <UpdatePlace />
         </Route>
         <Redirect to="/" />
      </Switch>
   ) : (
      <Switch>
         <Route path="/" exact>
            <Users />
         </Route>
         <Route path="/:userId/places">
            <UserPlaces />
         </Route>
         <Route path="/auth">
            <Auth />
         </Route>
         <Redirect to="/auth" />
      </Switch>
   );

   return (
      <AuthContext.Provider
         value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            login: login,
            logout: logout,
         }}
      >
         <Router>
            <MainNavigation />
            <main>
               <Suspense
                  fallback={
                     <div className="center">
                        <LoadingSpinner />
                     </div>
                  }
               >
                  {routes}
               </Suspense>
            </main>
         </Router>
      </AuthContext.Provider>
   );
}

export default App;
