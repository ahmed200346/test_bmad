'use server';

import { signToken } from '@/lib/auth';

export async function getDevToken(role: 'PM' | 'SPECIALIST') {
  if (role === 'PM') {
    return signToken({ id: 1, username: 'admin', role: 'PM' });
  }
  return signToken({ id: 2, username: 'marcus', role: 'SPECIALIST', specialistId: 1 });
}
