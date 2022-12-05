import { v4 as uuid } from 'uuid';

import SequelizeInstance from './src/lib/db/SequelizeInstance';
import Team from './src/lib/db/Team';

const t = Team.build({
  id: uuid(),
  displayName: 'foo',
  location: 'bar',
});

t.save();
