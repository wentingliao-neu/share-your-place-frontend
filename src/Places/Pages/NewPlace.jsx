import { useForm } from "../../Shared/hooks/form-hooks";
import { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import {
   VALIDATOR_MINLENGTH,
   VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import Button from "../../Shared/Components/FormElements/Button";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import { AuthContext } from "../../Shared/context/auth-context";
import "./PlaceForm.css";

export default function NewPlace() {
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const auth = useContext(AuthContext);
   const [formState, inputHandler] = useForm(
      {
         title: { value: "", isValid: false },
         description: { value: "", isValid: false },
         address: { value: "", isValid: false },
         image: { value: null, isValid: false },
      },
      false
   );
   const history = useHistory();
   async function placeSubmitHandler(event) {
      event.preventDefault();
      try {
         const formData = new FormData();
         formData.append("title", formState.inputs.title.value);
         formData.append("description", formState.inputs.description.value);
         formData.append("address", formState.inputs.address.value);
         formData.append("image", formState.inputs.image.value);
         await sendRequest(
            process.env.REACT_APP_BACKEND_URL + "/places",
            "POST",
            formData,
            { Authorization: "Bearer " + auth.token }
         );
         history.push("/");
         //redirect
      } catch (err) {}
   }
   return (
      <>
         <ErrorModal error={error} onClear={clearError} />

         <form className="place-form" onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpinner asOverlay />}
            <Input
               id="title"
               element="input"
               type="text"
               label="Title"
               validators={[VALIDATOR_REQUIRE()]}
               errorText="Please enter a valid title."
               onInput={inputHandler}
            />
            <Input
               id="description"
               element="textarea"
               label="Description"
               validators={[VALIDATOR_MINLENGTH(5)]}
               errorText="Please enter a valid description(at least 5 characters)."
               onInput={inputHandler}
            />
            <Input
               id="address"
               element="input"
               label="Address"
               validators={[VALIDATOR_REQUIRE()]}
               errorText="Please enter a valid address."
               onInput={inputHandler}
            />
            <ImageUpload
               id="image"
               onInput={inputHandler}
               errorText="Please provide an image."
            />
            <Button type="submit" disabled={!formState.isValid}>
               ADD PLACE
            </Button>
         </form>
      </>
   );
}
