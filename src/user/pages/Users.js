import React from 'react';
import UserList from '../components/UserList';
const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'Max',
            placeCount: 2,
            image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
    ]
    return (
        <UserList items={USERS} />
    )
}

export default Users