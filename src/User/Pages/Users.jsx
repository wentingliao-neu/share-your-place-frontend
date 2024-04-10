import { useEffect, useState } from "react";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import UsersList from "../Components/UsersList";
import { useHttpClient } from "../../Shared/hooks/http-hook";
export default function Users() {
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [loadedUsers, setLoadedUsers] = useState();
   useEffect(() => {
      async function fetchUsers() {
         try {
            const responseData = await sendRequest(
               process.env.REACT_APP_BACKEND_URL + "/users"
            );

            setLoadedUsers(responseData.users);
         } catch (err) {}
      }
      fetchUsers();
   }, [sendRequest]);

   return (
      <>
         <ErrorModal error={error} onClear={clearError} />
         {isLoading && (
            <div className="center">
               <LoadingSpinner asOverlay />
            </div>
         )}
         {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      </>
   );
}
