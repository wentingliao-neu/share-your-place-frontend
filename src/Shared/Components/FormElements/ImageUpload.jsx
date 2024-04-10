import { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

export default function ImageUpload(props) {
   const [file, setFile] = useState();
   const [previewUrl, setPreviewUrl] = useState();
   const [isValid, setIsValid] = useState(false);
   const filePickerRef = useRef();
   function pickedHandler(event) {
      let pickedFile;
      let fileIsValid = isValid;
      if (event.target.files || event.target.files.length === 1) {
         pickedFile = event.target.files[0];
         setFile(pickedFile);
         setIsValid(true);
         fileIsValid = true;
      } else {
         setIsValid(false);
         fileIsValid = false;
      }
      props.onInput(props.id, pickedFile, fileIsValid);
   }
   function pickImageHandler() {
      filePickerRef.current.click();
   }

   useEffect(() => {
      if (!file) return;
      const fileReader = new FileReader();
      fileReader.onload = () => {
         setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
   }, [file]);

   return (
      <div className="form-control">
         <input
            id={props.id}
            style={{ display: "none" }}
            ref={filePickerRef}
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={pickedHandler}
         />
         <div className={`image-upload ${props.center && "center"}`}>
            <div className="image-upload__preview">
               {previewUrl ? (
                  <img src={previewUrl} alt="preview" />
               ) : (
                  <p>Please pick an image.</p>
               )}
            </div>
            <Button type="button" onClick={pickImageHandler}>
               PICK IMAGE
            </Button>
         </div>
         {!isValid && <p>{props.errorText}</p>}
      </div>
   );
}
