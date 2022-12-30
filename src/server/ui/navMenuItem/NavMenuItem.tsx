import MenuItem from '@mui/material/MenuItem';
import useRouterLink from '../routerLink/useRouterLink';

type NavMenuItemProps = {
  children: React.ReactNode;
  to: string;
};
const NavMenuItem = ({ children, to }: NavMenuItemProps) => {
  // This hacky shite is necessary in order to get MUI to behave like
  // a grownup with react-router-dom.
  const RouterLink = useRouterLink(to);
  return <MenuItem component={RouterLink}>{children}</MenuItem>;
};

export default NavMenuItem;
