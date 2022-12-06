import { v4 as uuid } from 'uuid';

// This is needed for side effects
import SequelizeInstance from './src/lib/db/SequelizeInstance';

import Team from './src/lib/db/Team';
import User from './src/lib/db/User';

(async () => {
  const t = Team.build({
    id: uuid(),
    teamName: 'foo',
    location: 'bar',
  });

  await t.save();

  const teams = await Team.findAll();

  const fromDB = teams[0];

  fromDB.teamName = 'baz';

  await fromDB.save();

  const user = User.build({
    id: uuid(),
    userName: 'Jackson',
    location: 'London',
    teamId: fromDB.id,
  });

  await user.save();
})();
