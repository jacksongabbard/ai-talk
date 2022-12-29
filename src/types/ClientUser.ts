import type User from 'src/lib/db/User';

export type ClientUser = {
  id: string;
  createdAt: Date;
  teamId?: string;
  userName: string;
  location: string;
  emailAddress?: string;
  profilePic?: string;
  active: boolean;
  public: boolean;
};

export function userToClientUser(u: User): ClientUser {
  return {
    id: u.id,
    createdAt: u.createdAt,
    teamId: u.teamId,
    userName: u.userName,
    location: u.location,
    profilePic: u.profilePic,
    active: u.active,
    public: u.public,
  };
}
