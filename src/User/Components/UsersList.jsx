import Card from "../../Shared/Components/UIElements/Card";
import UserItem from "./UserItem";

import "./UsersList.css";
export default function UsersList({ items }) {
   if (items.length === 0)
      return (
         <div className="center">
            <Card>
               <h2>No Users found</h2>
            </Card>
         </div>
      );
   else
      return (
         <ul className="users-list">
            {items.map((item) => (
               <UserItem key={item.id} user={item} />
            ))}
         </ul>
      );
}
