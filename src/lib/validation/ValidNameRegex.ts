const ValidNameRegex = /^(?:[a-zA-Z0-9][a-zA-Z0-9_-]{0,46}[a-zA-Z0-9])$/;

// For AJV, we need the same regex, but without the slashes
const str = ValidNameRegex.toString();
export const ValidNameRegexForAJV = str
  .substring(0, str.length - 1)
  .substring(1);

export default ValidNameRegex;
