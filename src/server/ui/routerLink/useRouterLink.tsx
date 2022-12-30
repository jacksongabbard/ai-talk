import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

function useRouterLink(to: string) {
  return React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
        function RouterLink(linkProps, ref) {
          return <Link ref={ref} to={to} {...linkProps} />;
        },
      ),
    [to],
  );
}

export default useRouterLink;
