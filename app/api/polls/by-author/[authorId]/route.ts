import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPoll, getAllPolls, getPollsByAuthor } from '@/lib/db/polls';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ authorId: string }> }
) {
  try{

    //convert authorId params to number
    const resolvedParams = await params;
    const authorIdStr = resolvedParams.authorId;

    const poll = await getPollsByAuthor(authorIdStr);
    return NextResponse.json(poll);


  }
  catch (err) {
    console.error('Error fetching author:', err);
    return NextResponse.json({ 
      error: 'Poll not found', 
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 404 });
  }

}