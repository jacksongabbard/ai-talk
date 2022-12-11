import { v4 as uuid } from 'uuid';
import type { Request } from 'express';
import DTSGToken from 'src/lib/db/DTSGToken';
import getRandomFill from './getRandomFill';
import { Op, Sequelize } from 'sequelize';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

type DTSGValue = {
  ip: string;
  userAgent: string;
};

async function cleanup() {
  return DTSGToken.destroy({
    where: {
      expiresAt: {
        [Op.lt]: Sequelize.fn('NOW'),
      },
    },
  });
}

const dtsgKeySize = 12;
export async function makeDTSG(req: Request): Promise<string> {
  const tokenKey = getRandomFill(dtsgKeySize);

  const tokenValue: DTSGValue = {
    ip: req.ip,
    userAgent: req.get('user-agent') || 'unknown',
  };

  await cleanup();

  const dtsg = DTSGToken.build({
    id: uuid(),
    expiresAt: Date.now() + 1 * 60 * 60 * 1000,
    tokenKey,
    tokenValue,
  });
  await dtsg.save();

  return tokenKey;
}

export async function validateDTSG(
  tokenKey: string,
  req: Request,
): Promise<boolean> {
  await cleanup();

  const dtsg = await DTSGToken.findOne({
    where: {
      tokenKey,
    },
  });

  if (!dtsg) {
    console.error('DTSG token key with no record: ' + tokenKey);
    return false;
  }

  const { tokenValue } = dtsg;
  if (
    tokenValue &&
    hasOwnProperty(tokenValue, 'ip') &&
    typeof tokenValue.ip === 'string' &&
    hasOwnProperty(tokenValue, 'userAgent') &&
    typeof tokenValue.userAgent === 'string'
  ) {
    if (
      tokenValue.ip === req.ip &&
      tokenValue.userAgent === (req.get('user-agent') || 'unknown')
    ) {
      return true;
    } else {
      const obj = {
        ip: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
      };
      console.log(
        'DTSG IP or UA mismatch: Stored: ' +
          JSON.stringify(tokenValue) +
          ' vs. Request: ' +
          JSON.stringify(obj),
      );
      return false;
    }
  }

  console.error('Invalid DTSG token value: ' + JSON.stringify(tokenValue));
  return false;
}
