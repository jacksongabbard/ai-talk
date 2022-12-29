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
    .split('+')[0] // trim off any gmail address hijinx that adds a lot of chars
    .toLowerCase()
    .replace(/[^A-Za-z0-9]/g, '_');

  let userName = sanitizedStub;
  if ((randomTitle + '_' + userName).length < 48) {
    userName = randomTitle + '_' + userName;
  }

  const suffix = '_the_' + randomAdj;
  if ((userName + suffix).length < 48) {
    userName += suffix;
  }

  return userName;
}

export default makeUserNameFromEmail;
