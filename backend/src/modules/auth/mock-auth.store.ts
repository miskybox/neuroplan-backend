import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

export type MockUser = {
  id: string;
  email: string;
  passwordHash: string;  // Cambiado de 'password' a 'passwordHash'
  role: string;
  first_name: string;
  last_name: string;
  center_id?: string | null;
  active: boolean;
};

class MockAuthStoreClass {
  private users: Map<string, MockUser> = new Map();

  constructor() {
    // Pre-seed user for E2E tests (con hash)
    this.initializeSeedUser();
  }

  private async initializeSeedUser() {
    const seededEmail = 'e2e-test@neuroplan.com';
    const existing = this.findByEmail(seededEmail);
    if (!existing) {
      // Hash de la contraseña 'E2eTest2024!'
      const passwordHash = await bcrypt.hash('E2eTest2024!', 10);
      const user: MockUser = {
        id: randomUUID(),
        email: seededEmail,
        passwordHash,
        role: 'ORIENTADOR',
        first_name: 'E2E',
        last_name: 'Test User',
        center_id: 'd863f99c-5a75-4e4d-8cb9-8f12c64eacac',
        active: true,
      };
      this.users.set(user.id, user);
    }
  }

  async create(user: Omit<MockUser, 'id' | 'active' | 'passwordHash'> & { password: string; active?: boolean }): Promise<MockUser> {
    const existing = this.findByEmail(user.email);
    if (existing) return existing;

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(user.password, 10);

    const newUser: MockUser = {
      id: randomUUID(),
      email: user.email,
      passwordHash,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      center_id: user.center_id,
      active: user.active ?? true,
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user) return false;

    return await bcrypt.compare(password, user.passwordHash);
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