/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/context';

interface User {
  username: string;
  email: string;
  uid: string;
}

const Profile: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const [isLoading, setLoadingState] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setLoadingState(true);

    firebase?.users().on('value', (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      setUsers(usersList);
      setLoadingState(false);
    });

    return function cleanup(): void {
      firebase?.users().off();
    };
  }, [firebase]);

  return (
    <div>
      <h1>Admin Page</h1>
      {isLoading && <div>Loading...</div>}
      <UserList users={users} />
    </div>
  );
};

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }): JSX.Element => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

export default Profile;
