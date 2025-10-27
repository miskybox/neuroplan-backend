import { SupabaseService } from '../supabase/supabase.service';

export class PeiRepo {
  constructor(private readonly supabase: SupabaseService) {}

  async createPei(userId: string, pei: any) {
    const cli = this.supabase.get();
    const { data, error } = await cli
      .from('peis')
      .insert([{ user_id: userId, pei }])
      .select();
    if (error) throw new Error(error.message);
    return data[0];
  }
}
