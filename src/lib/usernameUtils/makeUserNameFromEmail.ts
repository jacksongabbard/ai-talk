import getRandomAdjective from './getRandomAdjective';
import getRandomTitle from './getRandomTitle';

function makeUserNameFromEmail(email: string): string {
  if (!email.includes('@') || email.indexOf('@') === -1) {
    throw new Error(
      'Attempting to generate a user name from something other than an email address',
    );
  }

  const randomAdj = getRandomAdjective();
  const randomTitle = getRandomTitle();
  const sanitizedStub = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^A-Za-z0-9]/g, '_');

  const userName = randomTitle + '_' + sanitizedStub + '_the_' + randomAdj;

  return userName;
}

export default makeUserNameFromEmail;
