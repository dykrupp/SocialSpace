import React, { useContext, useState, useEffect } from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import * as ROUTES from '../../../../../constants/routes';
import { useHistory } from 'react-router-dom';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { UserProfileUID } from '../../../../../constants/interfaces';

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    height: '35px',
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
  },
  searchInput: {
    color: 'white',
  },
  autoComplete: {
    width: '100%',
  },
}));

export const SearchBar: React.FC = () => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const history = useHistory();
  const [users, setUsers] = useState<UserProfileUID[]>([]);
  const [searchString, setSearchString] = useState('');

  const handleSearchChange = (
    event: React.ChangeEvent<{}>,
    value: string
  ): void => {
    setSearchString(value);
  };

  const onSearchSubmit = (): void => {
    const searchedUser = users.find((user) => user.fullName === searchString);
    if (searchedUser) {
      history.push(`${ROUTES.PROFILE}/${searchedUser.uid}`);
      setSearchString('');
    }
  };

  useEffect(() => {
    firebase?.users().on('value', (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      })) as UserProfileUID[];

      setUsers(usersList.filter((user) => user.uid !== authUser?.uid));
    });

    return function cleanup(): void {
      firebase?.users().off();
    };
  }, [firebase, authUser]);

  return (
    <div className={classes.searchBar}>
      <IconButton color="inherit" onClick={(): void => onSearchSubmit()}>
        <SearchIcon />
      </IconButton>
      <Autocomplete
        freeSolo
        disableClearable
        className={classes.autoComplete}
        classes={{
          input: classes.searchInput,
        }}
        autoComplete={true}
        inputValue={searchString}
        onInputChange={handleSearchChange}
        onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>): void => {
          if (event.key === 'Enter') onSearchSubmit();
        }}
        options={users.map((option) => option.fullName)}
        renderInput={(params): JSX.Element => (
          <TextField
            {...params}
            placeholder="Search SocialSpace..."
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
          />
        )}
      />
    </div>
  );
};
