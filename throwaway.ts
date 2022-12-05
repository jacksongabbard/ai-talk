import SequelizeInstance from './src/lib/db/SequelizeInstance';
import Team from './src/lib/db/Team';

const t = Team.build({
  displayName: 'foo',
  location: 'bar',
});

t.save();
