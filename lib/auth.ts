import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-12345');

export type UserSession = {
  id: number;
  username: string;
  role: 'PM' | 'SPECIALIST';
  specialistId?: number;
};

export async function signToken(payload: UserSession) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as UserSession;
  } catch (e) {
    return null;
  }
}

export function checkRole(user: UserSession, requiredRole: 'PM' | 'SPECIALIST') {
  if (user.role !== requiredRole) {
    throw new Error(`Forbidden: Required role ${requiredRole}, but user has ${user.role}`);
  }
}
