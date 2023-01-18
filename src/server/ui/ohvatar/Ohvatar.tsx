import { Person } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import type { ClientUser } from 'src/types/ClientUser';
import { hydrateSerializedClientUser } from 'src/types/ClientUser';

type OhvatarProps = {
  userId: string;
};
const Ohvatar: React.FC<OhvatarProps> = ({ userId }) => {
  const [user, setUser] = useState<ClientUser>();

  useEffect(() => {
    (async () => {
      const resp = await callAPI('get-user-by-id', { userId });
      if (hasOwnProperty(resp, 'user')) {
        try {
          const _user = hydrateSerializedClientUser(resp.user);
          setUser(_user);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [userId, setUser]);

  const css = {
    height: 30,
    width: 30,
  };
  if (!user) {
    return (
      <Avatar css={css}>
        <Person />
      </Avatar>
    );
  }

  if (user.profilePic) {
    return <Avatar css={css} src={user.profilePic} />;
  } else {
    return <Avatar css={css}>{user.userName[0]}</Avatar>;
  }
};

export default Ohvatar;
