import crypto from 'crypto';
import db from './db';

export class AuditLog {
  static async logAction(action: string, data: any) {
    const dataString = JSON.stringify(data);
    const lastEntry = db.prepare('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1').get() as { hash: string } | undefined;
    const previousHash = lastEntry?.hash || '0';

    const hash = crypto.createHmac('sha256', process.env.AUDIT_SECRET || 'default-secret')
      .update(previousHash + action + dataString)
      .digest('hex');

    db.prepare('INSERT INTO audit_log (action, data, hash, previousHash) VALUES (?, ?, ?, ?)').run(action, dataString, hash, previousHash);

    return hash;
  }

  static verifyIntegrity(): { valid: boolean; brokenAt?: number } {
    const logs = db.prepare('SELECT * FROM audit_log ORDER BY id ASC').all() as any[];
    let lastHash = '0';

    for (const log of logs) {
      const expectedHash = crypto.createHmac('sha256', process.env.AUDIT_SECRET || 'default-secret')
        .update(lastHash + log.action + log.data)
        .digest('hex');

      if (log.hash !== expectedHash) {
        return { valid: false, brokenAt: log.id };
      }
      lastHash = log.hash;
    }

    return { valid: true };
  }
}
