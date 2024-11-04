import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
