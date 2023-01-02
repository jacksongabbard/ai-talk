import CookieParser from 'cookie-parser';

import getDotEnv from './src/lib/dotenv';

const config = getDotEnv();

console.log(
CookieParser.signedCookie(
  "s%3AtMNnD7CR6xGl.Qfde24SjkQ7gZ9OTOOGo5UPxGT4caqY2USR3GkG2WCY",
  config.COOKIE_PARSER_SECRET,
));
