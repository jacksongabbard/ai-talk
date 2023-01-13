import type { RequestHandler, Request, Response } from 'express';
import { bail500 } from '../api/util';
import User from 'src/lib/db/User';
import Team from 'src/lib/db/Team';
import {
  getAllWebSockets,
  getDetailsForSocket,
} from 'src/server/websockets/SocketMaps';

export const status: RequestHandler = async (req: Request, res: Response) => {
  if (!req.context?.user) {
    bail500('nope.', res);
    return;
  }

  const { user } = req.context;
  if (user.userName.toLowerCase() !== 'jackson') {
    bail500('nope.', res);
    return;
  }

  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  const teams = await Team.findAll();

  const userIdToName: { [uuid: string]: string } = {};
  for (let user of users) {
    userIdToName[user.id] = user.userName;
  }

  const teamIdToName: { [uuid: string]: string } = {};
  for (let team of teams) {
    teamIdToName[team.id] = team.teamName;
  }

  const output = ['Active Users'];
  output.push('------------');
  const sockets = getAllWebSockets();
  output.push(sockets.length + ' connected users');
  for (const s of sockets) {
    const row: string[] = [];
    const deets = getDetailsForSocket(s);
    if (deets.user) {
      row.push(deets.user.userName);
    } else {
      row.push('Unknown user');
    }

    if (deets.team) {
      row.push(deets.team.teamName);
    } else {
      row.push('Unknown team');
    }

    if (deets.puzzleInstance) {
      row.push(deets.puzzleInstance.puzzleId);
    } else {
      row.push('Unknown puzzle');
    }

    output.push(row.join('\t\t\t'));
  }

  output.push('\n');
  output.push('Users: ' + users.length);
  output.push('<table>');
  for (let user of users) {
    output.push(
      `<tr>
        <td>${user.userName}</td>
        <td>${user.teamId ? teamIdToName[user.teamId] : '<no team>'}</td>
        <td>${user.createdAt.toLocaleString()}</td>
      </tr>`,
    );
  }
  output.push('</table>');

  res.status(200);
  res.send('<pre>' + output.join('\n') + '</pre>');
};
