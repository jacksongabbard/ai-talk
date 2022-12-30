import type Team from 'src/lib/db/Team';

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
