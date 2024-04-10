import { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import Card from "../../Shared/Components/UIElements/Card";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import {
   VALIDATOR_REQUIRE,
   VALIDATOR_MINLENGTH,
} from "../../Shared/util/validators";
import { useForm } from "../../Shared/hooks/form-hooks";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import { AuthContext } from "../../Shared/context/auth-context";
import "./PlaceForm.css";

export default function UpdatePlace() {
   const auth = useContext(AuthContext);

   const placeId = useParams().placeId;
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [loadedPlace, setLoadedPlace] = useState();
   const history = useHistory();
   const [formState, inputHandler, setFormData] = useForm(
      {
         title: { value: "", isValid: false },
         description: { value: "", isValid: false },
      },
      false
   );

   async function placeUpdateSubmitHandler(event) {
      event.preventDefault();
      try {
         await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
            "PATCH",
            JSON.stringify({
               title: formState.inputs.title.value,
               description: formState.inputs.description.value,
            }),
            {
               "Content-Type": "application/json",
               Authorization: "Bearer " + auth.token,
            }
         );
         history.push(`/${auth.userId}/places`);
      } catch (err) {}
   }
   useEffect(() => {
      const fetchPlace = async () => {
         try {
            const responseData = await sendRequest(
               `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
            );

            setLoadedPlace(responseData.place);
            setFormData({
               title: { value: responseData.place.title, isValid: true },
               description: {
                  value: responseData.place.description,
                  isValid: true,
               },
            });
         } catch (err) {}
      };
      fetchPlace();
   }, [sendRequest, placeId, setFormData]);

   if (isLoading) {
      return (
         <div className="center">
            <LoadingSpinner />
         </div>
      );
   }

   if (!loadedPlace && !error)
      return (
         <div className="center">
            <Card>
               <h2>Cound not find the place</h2>
            </Card>
         </div>
      );

   return (
      <>
         <ErrorModal error={error} onClear={clearError} />
         {!isLoading && loadedPlace && (
            <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
               <Input
                  id="title"
                  element="input"
                  type="text"
                  label="Title"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid title."
                  onInput={inputHandler}
                  initialValue={loadedPlace.title}
                  initialValid={true}
               ></Input>
               <Input
                  id="description"
                  element="textarea"
                  label="Description"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid description (at least 5 characters)."
                  onInput={inputHandler}
                  initialValue={loadedPlace.description}
                  initialValid={true}
               ></Input>
               <Button type="submit" disabled={!formState.isValid}>
                  UPDATE PLACE
               </Button>
            </form>
         )}
      </>
   );
}
