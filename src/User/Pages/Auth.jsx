import Input from "../../Shared/Components/FormElements/Input";
import Card from "../../Shared/Components/UIElements/Card";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Button from "../../Shared/Components/FormElements/Button";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import { useState, useContext } from "react";
import {
   VALIDATOR_EMAIL,
   VALIDATOR_MINLENGTH,
   VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import { useForm } from "../../Shared/hooks/form-hooks";
import { AuthContext } from "../../Shared/context/auth-context";
import "./Auth.css";

export default function Auth() {
   const auth = useContext(AuthContext);
   const [isLogin, setIsLogin] = useState(true);
   const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [formState, inputHandler, setFormData] = useForm(
      {
         email: { value: "", isValid: false },
         password: { value: "", isValid: false },
      },
      false
   );
   const authSubmitHandler = async (event) => {
      event.preventDefault();

      if (isLogin) {
         try {
            const data = await sendRequest(
               process.env.REACT_APP_BACKEND_URL + "/users/login",
               "POST",
               JSON.stringify({
                  email: formState.inputs.email.value,
                  password: formState.inputs.password.value,
               }),
               { "Content-Type": "application/json" }
            );

            auth.login(data.userId, data.token);
         } catch (err) {}
      } else {
         try {
            const formData = new FormData();
            formData.append("email", formState.inputs.email.value);
            formData.append("name", formState.inputs.name.value);
            formData.append("password", formState.inputs.password.value);
            formData.append("image", formState.inputs.image.value);
            const data = await sendRequest(
               process.env.REACT_APP_BACKEND_URL + "/users/signup",
               "POST",
               formData
            );

            auth.login(data.userId, data.token);
         } catch (err) {}
      }
   };
   function switchModeHandler() {
      if (!isLogin)
         setFormData(
            { ...formState.inputs, name: undefined, image: undefined },
            formState.inputs.email.isValid && formState.inputs.password.isValid
         );
      else
         setFormData(
            {
               ...formState.inputs,
               name: { value: "", isValid: false },
               image: { value: null, isValid: false },
            },
            false
         );
      setIsLogin((isLogin) => !isLogin);
   }
   return (
      <>
         <ErrorModal error={error} onClear={clearError} />
         <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h2 className="authentication__header">Login Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
               {!isLogin && (
                  <>
                     <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid name."
                        onInput={inputHandler}
                     />
                     <ImageUpload
                        id="image"
                        center
                        onInput={inputHandler}
                        errorText="Please provide an image."
                     />
                  </>
               )}

               <Input
                  id="email"
                  element="input"
                  type="email"
                  label="Email"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="Please enter a valid email address."
                  onInput={inputHandler}
               />
               <Input
                  id="password"
                  element="input"
                  type="password"
                  label="Password"
                  validators={[VALIDATOR_MINLENGTH(8)]}
                  errorText="Please enter a valid password with at least 8 digits."
                  onInput={inputHandler}
               />
               <Button type="submit" disabled={!formState.isValid}>
                  {isLogin ? "Log In" : "Sign Up"}
               </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
               {!isLogin ? "Log In" : "Sign Up"}
            </Button>
         </Card>
      </>
   );
}
