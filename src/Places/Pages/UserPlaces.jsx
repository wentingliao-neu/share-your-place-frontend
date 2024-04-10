import React, { useEffect, useState } from "react";
import PlaceList from "../Components/PlaceList";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const UserPlaces = () => {
   const userId = useParams().userId;
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [loadedPlaces, setLoadedPlaces] = useState();
   useEffect(() => {
      async function fetchPlaces() {
         try {
            const data = await sendRequest(
               `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
            );
            setLoadedPlaces(data.places);
         } catch (err) {}
      }
      fetchPlaces();
   }, [sendRequest, userId]);

   function placeDeletedHandler(deletePid) {
      setLoadedPlaces((prevPlaces) =>
         prevPlaces.filter((p) => p.id !== deletePid)
      );
   }
   return (
      <>
         <ErrorModal error={error} onClear={clearError} />
         {isLoading && (
            <div className="center">
               <LoadingSpinner />
            </div>
         )}
         {!isLoading && loadedPlaces && (
            <PlaceList
               items={loadedPlaces}
               onDeletePlace={placeDeletedHandler}
            />
         )}
      </>
   );
};
export default UserPlaces;
