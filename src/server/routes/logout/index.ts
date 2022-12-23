import type { RequestHandler, Request, Response } from 'express';
import AuthToken from 'src/lib/db/AuthToken';

export const logout: RequestHandler = async (req: Request, res: Response) => {
  const { datr } = req.signedCookies;

  console.log({ datr });

  if (!datr) {
    console.log('No DATR on logout');
    res.redirect('/auth');
    return;
  }

  const session = await AuthToken.findOne({
    where: { tokenValue: datr },
  });

  if (session) {
    await session.destroy();
  }

  res.cookie('datr', '', {
    maxAge: -1,
    signed: true,
    httpOnly: true,
  });
  res.redirect('/auth');
};
