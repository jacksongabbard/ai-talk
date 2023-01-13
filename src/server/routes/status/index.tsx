import type { RequestHandler, Request, Response } from 'express';
import { bail500 } from '../api/util';
import User from 'src/lib/db/User';
import Team from 'src/lib/db/Team';
import {
  getAllWebSockets,
  getDetailsForSocket,
} from 'src/server/websockets/SocketMaps';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { convertSecondsToTime } from 'src/lib/time/util';
import { renderPage } from 'src/server/ui/util';

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
  output.push('<table>');
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

    output.push(
      '<tr>' + row.map((cell) => `<td>|${cell}</td>`).join('') + '</tr>',
    );
  }
  output.push('</table>');

  output.push('\n');
  output.push('Users: ' + users.length);
  output.push('-----------------------------');
  output.push('<table>');
  for (let user of users) {
    output.push(
      `<tr>
        <td>|${user.createdAt.toLocaleString()}</td>
        <td>|${user.userName}</td>
        <td>|${user.teamId ? teamIdToName[user.teamId] : '<no team>'}</td>
      </tr>`,
    );
  }
  output.push('</table>');

  const puzzleInstances = await PuzzleInstance.findAll({
    order: [['updatedAt', 'DESC']],
  });
  output.push('\n');
  output.push('Puzzle Instances: ' + puzzleInstances.length);
  output.push('------------------------------------------');
  output.push('<table>');
  for (const pi of puzzleInstances) {
    output.push(`
      <tr>
        <td>|${pi.updatedAt.toLocaleString()}</td>
        <td>|${pi.puzzleId}</td> 
        <td>|${pi.teamId ? teamIdToName[pi.teamId] : ''}</td>
        <td>|${pi.userId ? userIdToName[pi.userId] : ''}</td>
        <td>|${pi.sequenceNumber}</td>
        <td>|${pi.solvedAt ? pi.solvedAt?.toLocaleString() : ''}</td>
        <td>|${
          pi.solvedAt
            ? convertSecondsToTime(
                (pi.solvedAt.getTime() - pi.createdAt?.getTime()) / 1000,
                '.',
              )
            : ''
        }</td>
      </tr>
    `);
  }
  output.push('</table>');
  let html = '<pre>' + output.join('\n') + '</pre>';
  html += `<script type="text/javascript">setTimeout(() => { window.location.reload(); }, 5000);</script>`;
  res.status(200);
  res.send(renderPage(<div dangerouslySetInnerHTML={{ __html: html }} />));
};
