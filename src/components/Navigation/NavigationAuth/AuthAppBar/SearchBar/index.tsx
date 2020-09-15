import React, { useState, useContext } from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import * as ROUTES from '../../../../../utils/constants/routes';
import { useHistory } from 'react-router-dom';
import { UserProfileUID } from '../../../../../utils/constants/interfaces';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    height: '35px',
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
  searchButton: {
    alignSelf: 'center',
  },
}));

interface SearchBarProps {
  users: UserProfileUID[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ users }) => {
  const classes = useStyles();
  const history = useHistory();
  const [searchString, setSearchString] = useState('');
  const authUser = useContext(AuthUserContext);

  const handleSearchChange = (value: string): void => {
    setSearchString(value);
  };

  const onSearchSubmit = (): void => {
    const searchedUser = users.find((user) => user.fullName === searchString);
    if (searchedUser) {
      history.push(`${ROUTES.PROFILE}/${searchedUser.uid}`);
      setSearchString('');
    }
  };

  return (
    <div className={classes.searchBar}>
      <IconButton
        className={classes.searchButton}
        color="inherit"
        onClick={(): void => onSearchSubmit()}
      >
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
        onInputChange={(_event, value): void => handleSearchChange(value)}
        onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>): void => {
          if (event.key === 'Enter') onSearchSubmit();
        }}
        options={users
          .filter((user) => user.uid !== authUser?.uid)
          .map((option) => option.fullName)}
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

SearchBar.propTypes = {
  users: PropTypes.array.isRequired,
};
