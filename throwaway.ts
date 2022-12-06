import { v4 as uuid } from 'uuid';

// This is needed for side effects
import SequelizeInstance from './src/lib/db/SequelizeInstance';

import Team from './src/lib/db/Team';
import User from './src/lib/db/User';
import PuzzleInstance from './src/lib/db/PuzzleInstance';

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

  const pi = PuzzleInstance.build({
    id: uuid(),
    puzzleId: 'foobarbaz',
    teamId: t.id,
    startedAt: new Date(),
    puzzlePayload: { foo: 'bar' },
    solutionPayload: { baz: 'qux' },
  });

  await pi.save();

  const pis = await PuzzleInstance.findAll();
  console.log(pis);
})();
