import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

type NavMenuItemProps = {
  children: React.ReactNode;
  to: string;
};
const NavMenuItem = ({ children, to }: NavMenuItemProps) => {
  // This hacky shite is necessary in order to get MUI to behave like
  // a grownup with react-router-dom.
  const MonkeyPatchLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
        function MoneyPatchLink(linkProps, ref) {
          return <Link ref={ref} to={to} {...linkProps} />;
        },
      ),
    [to],
  );
  return <MenuItem component={MonkeyPatchLink}>{children}</MenuItem>;
};

export default NavMenuItem;
