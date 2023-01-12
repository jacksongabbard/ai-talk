import { makeValidator } from 'src/lib/ajv/makeValidator';
import type Team from 'src/lib/db/Team';
import { UUIDRegexString } from 'src/lib/validation/UUIDRegex';

export type ClientTeam = {
  id: string;
  createdAt: Date;
  teamName: string;
  location: string;
  profilePic?: string;
  active: boolean;
  public: boolean;
};

export function teamToClientTeam(t: Team): ClientTeam {
  return {
    id: t.id,
    createdAt: t.createdAt,
    teamName: t.teamName,
    location: t.location,
    active: t.active,
    public: t.public,
  };
}

export type SerializedClientTeam = {
  id: string;
  createdAt: string;
  teamName: string;
  location: string;
  profilePic?: string;
  active: boolean;
  public: boolean;
};

const serializedClientTeamValidator = makeValidator({
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: UUIDRegexString,
    },
    createdAt: {
      type: 'string',
    },
    teamName: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    profilePic: {
      type: 'string',
    },
    active: {
      type: 'boolean',
    },
    public: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: ['id', 'createdAt', 'teamName', 'location', 'active', 'public'],
});

export function hydrateSerializedClientTeam(thing: any): ClientTeam {
  let serializedClientTeam: SerializedClientTeam;
  if (serializedClientTeamValidator(thing)) {
    serializedClientTeam = thing as SerializedClientTeam;
  } else {
    throw new Error(
      'Object provided is not a Serialized Client Team: ' +
        JSON.stringify(thing, null, 4),
    );
  }

  const clientTeam: ClientTeam = {
    ...serializedClientTeam,
    createdAt: new Date(serializedClientTeam.createdAt),
  };
  return clientTeam;
}
