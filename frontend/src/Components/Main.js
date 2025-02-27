import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import { useCookies } from 'react-cookie';
import { useHistory, useLocation } from 'react-router-dom';

export default function Main() {
  const [user, setUser] = useState([]);
  const [value, setValue] = useState(0);
  const [token, setToken, removeToken] = useCookies(['access_token']);
  const [tokenR, setTokenR, removeTokenR] = useCookies(['refresh_token']);

  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/profile/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token['access_token']}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setUser(resp);
      })
      .then(() => console.log(user))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Set the value based on the current path
    switch (location.pathname) {
      case '/main/':
        setValue(0);
        break;
      case '/recent/':
        setValue(1);
        break;
      case '/saved/':
        setValue(2);
        break;
      case '/bin/':
        setValue(3);
        break;
      default:
        setValue(0);
    }
  }, [location.pathname]);

  const logginOut = () => {
    fetch('http://127.0.0.1:8000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token['access_token']}`,
      },
      body: JSON.stringify({
        refresh_token: ` ${tokenR['refresh_token']}`,
      }),
    })
      .then(() => {
        removeToken('access_token', { path: '/' });
        removeTokenR('refresh_token', { path: '/' });
        window.location.replace('http://localhost:3000/');
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label={user.profile_name}
            icon={<Person2Icon />}
            onClick={() => {
              history.push('/main/');
              window.location.reload();
            }}
          />
          <BottomNavigationAction
            label="Recents"
            icon={<RestoreIcon />}
            onClick={() => {
              history.push('/recent/');
              window.location.reload();
            }}
          />
          <BottomNavigationAction
            label="Favorites"
            icon={<FavoriteIcon />}
            onClick={() => {
              history.push('/saved/');
              window.location.reload();
            }}
          />
          <BottomNavigationAction
            label="Bin"
            icon={<ArchiveIcon />}
            onClick={() => {
              history.push('/bin/');
              window.location.reload();
            }}
          />
          <BottomNavigationAction
            label="Logout"
            icon={<LogoutIcon />}
            onClick={() => {
              logginOut();
              history.push('/');
            }}
          />
        </BottomNavigation>
        <hr />
      </Box>
    </div>
  );
}