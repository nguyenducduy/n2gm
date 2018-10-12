import * as crypto from "crypto";

export const hashPassword = (password) => {
    let hash = crypto.createHmac("sha512", 'xFs9AyjYY3');
  hash.update(password);
  const value = hash.digest('hex');

  return value;
};
