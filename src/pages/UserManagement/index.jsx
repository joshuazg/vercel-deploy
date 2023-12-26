import React, { useEffect, useState } from 'react';
import { UserCard } from './userCard';
import { supabase } from '../../supabaseClient'
import Header from '../Header';
import '../../css/user_index.css'

const User = ({ token }) => {

  const [fetchError, setFetchError] = useState(null);
  const [user, setUserInfo] = useState(null);

  const metadata = [
    { key: 'full_name', value: token.user.user_metadata.full_name },
    { key: 'email', value: token.user.email }
  ];


  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase
        .from('user')
        .select('schoolId, username')

      if (error) {
        setFetchError('Could not fetch the user data');
        setUserInfo(null);
        console.log(error);
      }
      if (data) {
        setUserInfo(data);
        setFetchError(null);
      }
    }
    getUser()
  }, [])

  return (
    <div>
      <Header token={metadata} />

      <h1 className='caption'>User Management</h1>
      <div className="userBox">
        {fetchError && (<p>{fetchError}</p>)}
        <div style={styles.container}>
          {user && (
            <div style={styles.userCardContainer}>
              {user.map(user => (
                <div key={user.schoolId}>
                  <UserCard
                    schoolId={user.schoolId}
                    username={user.username}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding:'10px',
    width: '100%', // Set width to 100%

  },
  userCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
  },
}

export default User;