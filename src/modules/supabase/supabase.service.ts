import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://your-project.supabase.co',
      process.env.SUPABASE_ANON_KEY || 'your-anon-key'
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Auth methods
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    return { user, error };
  }

  // Database methods
  async from(table: string) {
    return this.supabase.from(table);
  }

  // Storage methods
  async uploadFile(bucket: string, path: string, file: Buffer, options?: any) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, options);
    return { data, error };
  }

  async downloadFile(bucket: string, path: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);
    return { data, error };
  }

  async getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data;
  }
}
