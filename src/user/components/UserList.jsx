import React from "react";
import UserItem from "./UserItem";

const UserList = (props) => {
    const {items} = props;
    return (
        <ul>
            {items.map(item => <UserItem key={item.id} image={item.image} id={item.id} name={item.name} placeCount={item.placeCount} />)}
        </ul>
    )
}

export default UserList