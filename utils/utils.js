import crypto from 'crypto'

export const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};