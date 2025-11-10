import { randomUUID } from 'crypto';

export type MockUser = {
  id: string;
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  center_id?: string | null;
  active: boolean;
};

class MockAuthStoreClass {
  private users: Map<string, MockUser> = new Map();

  constructor() {
    // Pre-seed user for E2E tests
    const seededEmail = 'e2e-test@neuroplan.com';
    const existing = this.findByEmail(seededEmail);
    if (!existing) {
      const user: MockUser = {
        id: randomUUID(),
        email: seededEmail,
        password: 'E2eTest2024!',
        role: 'ORIENTADOR',
        first_name: 'E2E',
        last_name: 'Test User',
        center_id: 'd863f99c-5a75-4e4d-8cb9-8f12c64eacac',
        active: true,
      };
      this.users.set(user.id, user);
    }
  }

  create(user: Omit<MockUser, 'id' | 'active'> & { active?: boolean }): MockUser {
    const existing = this.findByEmail(user.email);
    if (existing) return existing;

    const newUser: MockUser = {
      id: randomUUID(),
      active: user.active ?? true,
      ...user,
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  findByEmail(email: string): MockUser | undefined {
    for (const u of this.users.values()) {
      if (u.email === email) return u;
    }
    return undefined;
  }

  findById(id: string): MockUser | undefined {
    return this.users.get(id);
  }
}

export const MockAuthStore = new MockAuthStoreClass();