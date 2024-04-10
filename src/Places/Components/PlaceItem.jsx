import Card from "../../Shared/Components/UIElements/Card";
import Button from "../../Shared/Components/FormElements/Button";
import Modal from "../../Shared/Components/UIElements/Modal";
import Map from "../../Shared/Components/UIElements/Map";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { AuthContext } from "../../Shared/context/auth-context";
import "./PlaceItem.css";
import { useState, useContext } from "react";
import { useHttpClient } from "../../Shared/hooks/http-hook";
export default function PlaceItem({ place, onDelete }) {
   const auth = useContext(AuthContext);
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [showMap, setShowMap] = useState(false);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const openMapHandler = () => setShowMap(true);
   const closeMapHandler = () => setShowMap(false);
   function showDeleteWarningHandler() {
      setShowConfirmModal(true);
   }
   function cancelDeleteHandler() {
      setShowConfirmModal(false);
   }
   async function confirmDeleteHandler() {
      setShowConfirmModal(false);
      await sendRequest(
         `${process.env.REACT_APP_BACKEND_URL}/places/${place.id}`,
         "DELETE",
         null,
         { Authorization: "Bearer " + auth.token }
      );
      onDelete(place.id);
   }

   return (
      <>
         <ErrorModal error={error} onClear={clearError} />
         <Modal
            show={showMap}
            onCancel={closeMapHandler}
            header={place.address}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
         >
            <div className="map-container">
               <Map center={place.location} zoom={16} />
            </div>
         </Modal>
         <Modal
            show={showConfirmModal}
            onCancel={cancelDeleteHandler}
            header="Are you sure?"
            footerClass="place-item__modal-actions"
            footer={
               <>
                  <Button reverse onClick={cancelDeleteHandler}>
                     CANCEL
                  </Button>
                  <Button danger onClick={confirmDeleteHandler}>
                     DELETE
                  </Button>
               </>
            }
         >
            <p>
               Do you want to proceed and delete this place? Please note that it
               can't be undone thereafter.
            </p>
         </Modal>
         <li className="place-item">
            <Card className="place-item__content">
               {isLoading && <LoadingSpinner asOverlay />}
               <div className="place-item__image">
                  <img src={place.image} alt={place.title} />
               </div>
               <div className="place-item__info">
                  <h2>{place.title}</h2>
                  <h3>{place.address}</h3>
                  <p>{place.description}</p>
               </div>
               <div className="place-item__actions">
                  <Button inverse onClick={openMapHandler}>
                     VIEW ON MAP
                  </Button>
                  {auth.userId === place.creator && (
                     <>
                        <Button to={`/places/${place.id}`}>EDIT</Button>
                        <Button danger onClick={showDeleteWarningHandler}>
                           DELETE
                        </Button>
                     </>
                  )}
               </div>
            </Card>
         </li>
      </>
   );
}
