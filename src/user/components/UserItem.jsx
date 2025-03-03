import React from "react";

const UserItem = (props) => {
    return (
        <li>
            <div>
                <div>
                    <img src={props.image} alt={props.name} style={{width: '400px', height: '400px', borderRadius: '50%', objectFit: 'cover'}} />
                </div>
                <div>
                    <h2>{props.name}</h2>
                    <h3>{props.placeCount === 1 ? '1 place' : `${props.placeCount} places`}</h3>
                </div>
            </div>
        </li>
    )
}

export default UserItem