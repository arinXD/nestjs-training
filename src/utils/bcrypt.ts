import * as bcrypt from 'bcrypt';

export function hashing(string: string) {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hash(string, SALT);
}
