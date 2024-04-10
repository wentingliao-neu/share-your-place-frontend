import Card from "../../Shared/Components/UIElements/Card";
import Button from "../../Shared/Components/FormElements/Button";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";
export default function PlaceList(props) {
   if (props.items.length === 0) {
      return (
         <div className="place-list center">
            <Card>
               <h2>No places found. Maybe Create one?</h2>
               <Button to="/places/new">Share Place</Button>
            </Card>
         </div>
      );
   } else {
      return (
         <ul className="place-list">
            {props.items.map((item) => (
               <PlaceItem
                  key={item.id}
                  place={item}
                  onDelete={props.onDeletePlace}
               />
            ))}
         </ul>
      );
   }
}
