import "./NavLinks.css";
import { useContext } from "react";
import Button from "../FormElements/Button";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { AuthContext } from "../../context/auth-context";
export default function NavLinks() {
   const auth = useContext(AuthContext);
   return (
      <ul className="nav-links">
         <li>
            <NavLink to="/" exact>
               All Users
            </NavLink>
         </li>
         {auth.isLoggedIn && (
            <>
               <li>
                  <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
               </li>

               <li>
                  <NavLink to="/places/new">Add Place</NavLink>
               </li>
               <li>
                  <Button onClick={auth.logout}>Log Out</Button>
               </li>
            </>
         )}

         {!auth.isLoggedIn && (
            <li>
               <NavLink to="/auth">Authenticate</NavLink>
            </li>
         )}
      </ul>
   );
}
