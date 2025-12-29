import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPollById, deletePoll, updatePollVotes } from '@/lib/db/polls';

// GET single poll by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const resolvedParams = await params;
    
    console.log('Full params object:', resolvedParams);
    console.log('Raw pollId:', resolvedParams.pollId, 'Type:', typeof resolvedParams.pollId);
    
    const pollIdStr = resolvedParams.pollId;
    if (!pollIdStr || pollIdStr === 'undefined') {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 });
    }
    
    const pollIdNum = parseInt(pollIdStr, 10);
    if (isNaN(pollIdNum)) {
      return NextResponse.json({ 
        error: 'Invalid poll ID format', 
        received: pollIdStr,
        parsed: pollIdNum 
      }, { status: 400 });
    }
    
    console.log('Searching for poll_id:', pollIdNum, 'from string:', pollIdStr);
    
    const poll = await getPollById(pollIdNum);

    console.log('Found poll:', poll?.title);
    return NextResponse.json(poll);
  } catch (err) {
    console.error('Error fetching poll:', err);
    return NextResponse.json({ 
      error: 'Poll not found', 
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 404 });
  }
}

//updates a vote by Id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { optionId, userId } = await request.json();
    
    const pollIdNum = parseInt(resolvedParams.pollId, 10);
    if (isNaN(pollIdNum)) {
      return NextResponse.json({ error: 'Invalid poll ID format' }, { status: 400 });
    }

    if (!optionId) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 });
    }

    const updatedOption = await updatePollVotes(pollIdNum, optionId, userId);
    
    return NextResponse.json({ 
      message: 'Vote recorded successfully',
      option: updatedOption 
    });
  } catch (err) {
    console.error('Error updating vote:', err);
    return NextResponse.json({ 
      error: 'Failed to update vote',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE poll by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const resolvedParams = await params;
    const pollIdNum = parseInt(resolvedParams.pollId, 10);

    if (isNaN(pollIdNum)) {
      return NextResponse.json({ error: 'Invalid poll ID format' }, { status: 400 });
    }

    await deletePoll(pollIdNum);

    return NextResponse.json({ message: 'Poll deleted successfully' });
  } catch (err) {
    console.error('Error deleting poll:', err);
    return NextResponse.json({ 
      error: 'Failed to delete poll',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}