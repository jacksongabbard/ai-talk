import { makeValidator } from 'src/lib/ajv/makeValidator';
import type User from 'src/lib/db/User';

export type ClientUser = {
  id: string;
  createdAt: Date;
  teamId?: string;
  userName: string;
  location: string;
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

type SerializedClientUser = {
  id: string;
  createdAt: string;
  teamId?: string;
  userName: string;
  location: string;
  profilePic?: string;
  active: boolean;
  public: boolean;
};

export const validateIsSerializedClientUser = makeValidator({
  type: 'object',
  properties: {
    id: { type: 'string' },
    createdAt: { type: 'string' },
    teamId: { type: 'string' },
    userName: { type: 'string' },
    location: { type: 'string' },
    profilePic: { type: 'string' },
    active: { type: 'boolean' },
    public: { type: 'boolean' },
  },
  required: ['id', 'createdAt', 'userName', 'location', 'active', 'public'],
  additionalProperties: false,
});

export function hydrateSerializedClientUser(thing: any): ClientUser {
  if (validateIsSerializedClientUser(thing)) {
    const t = thing as SerializedClientUser;
    const clientUser: ClientUser = {
      id: t.id,
      createdAt: new Date(t.createdAt),
      teamId: t.teamId,
      userName: t.userName,
      location: t.location,
      profilePic: t.profilePic,
      active: t.active,
      public: t.public,
    };
    return clientUser;
  }

  throw new Error('Provided value is not a serialized client user');
}
