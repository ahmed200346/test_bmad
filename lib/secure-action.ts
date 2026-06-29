import { verifyToken, checkRole, UserSession } from './auth';
import { AuditLog } from './audit';

export async function secureAction<T>(
  token: string | undefined,
  actionName: string,
  fn: (user: UserSession) => Promise<T>,
  requiredRole?: 'PM' | 'SPECIALIST'
): Promise<T> {
  // 1. TLS Check (Mocked)
  // In production, this would check the 'x-forwarded-proto' header or use a secure transport check
  const isTlsSecure = true; // Mocking TLS 1.3 enforcement
  if (!isTlsSecure) {
    throw new Error("Insecure connection: TLS 1.3 is required for this action.");
  }

  // 2. Authentication
  if (!token) throw new Error("Unauthorized: No token provided.");
  const user = await verifyToken(token);
  if (!user) throw new Error("Unauthorized: Invalid or expired token.");

  // 3. RBAC
  if (requiredRole) {
    checkRole(user, requiredRole);
  }

  // 4. Execution & Auditing
  try {
    const result = await fn(user);
    await AuditLog.logAction(actionName, { user: user.username, result: 'success' });
    return result;
  } catch (e: any) {
    await AuditLog.logAction(actionName, { user: user.username, result: 'failure', error: e.message });
    throw e;
  }
}
