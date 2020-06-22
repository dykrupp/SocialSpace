import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { MessageDrawer } from './MessageDrawer';
import { AuthAppBar } from './AuthAppBar';

const useStyles = makeStyles(() => ({
  mainDiv: {
    flexGrow: 1,
    minWidth: '760px',
  },
}));

const NavigationAuthContainer: React.FC = () => {
  const classes = useStyles();

  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [mobileAnchor, setMobileAnchor] = React.useState<null | HTMLElement>(
    null
  );

  const handleMobileMenuClose = (): void => {
    setMobileAnchor(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMobileAnchor(event.currentTarget);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = (): void => {
    setMenuAnchor(null);
    handleMobileMenuClose();
  };

  return (
    <div className={classes.mainDiv}>
      <AuthAppBar
        setIsMessageDrawerOpen={setIsMessageDrawerOpen}
        handleMobileMenuOpen={handleMobileMenuOpen}
        handleUserMenuOpen={handleUserMenuOpen}
      />
      <MessageDrawer
        isDrawerOpen={isMessageDrawerOpen}
        setIsDrawerOpen={setIsMessageDrawerOpen}
      />
      <MobileMenu
        mobileMenuAnchor={mobileAnchor}
        handleUserMenuOpen={handleUserMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
      />
      <UserMenu menuAnchor={menuAnchor} handleMenuClose={handleUserMenuClose} />
    </div>
  );
};

export default NavigationAuthContainer;
