import { v4 as uuid } from 'uuid';

import SequelizeInstance from './src/lib/db/SequelizeInstance';
import Team from './src/lib/db/Team';

(async () => {
  const t = Team.build({
    id: uuid(),
    teamName: 'foo',
    location: 'bar',
  });

  await t.save();

  const teams = await Team.findAll();
  console.log(teams);

  const fromDB = teams[0];

  fromDB.teamName = 'baz';

  await fromDB.save();

  console.log(fromDB);
})();
