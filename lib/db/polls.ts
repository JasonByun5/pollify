import { createClient } from '@/lib/supabase/server';

export interface PollOption {
  index: number;
  title: string;
  desc: string;
  vote_count: number;
  image_url: string;
}

export interface Poll {
  id: string;
  poll_id: number;
  author: string;
  title: string;
  description: string;
  type: string;
  options: PollOption[];
  created_at: string;
}

export async function createPoll(pollData: Omit<Poll, 'id' | 'created_at'>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('polls')
    .insert({
      ...pollData,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllPolls() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPollById(pollId: number) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .eq('poll_id', pollId)
    .single();

  if (error) throw error;
  return data;
}

export async function getPollsByAuthor(author: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .eq('author', author)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updatePollVotes(pollId: number, optionIndex: number) {
  const supabase = await createClient();
  
  // First get the current poll
  const { data: poll, error: fetchError } = await supabase
    .from('polls')
    .select('options')
    .eq('poll_id', pollId)
    .single();

  if (fetchError) throw fetchError;

  // Update the vote count for the specific option
  const updatedOptions = poll.options.map((option: PollOption) => 
    option.index === optionIndex 
      ? { ...option, vote_count: option.vote_count + 1 }
      : option
  );

  // Update the poll with new options
  const { data, error } = await supabase
    .from('polls')
    .update({ options: updatedOptions })
    .eq('poll_id', pollId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
