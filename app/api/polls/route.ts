import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Parse form data
    const formData = await request.formData();
    const payloadString = formData.get('payload') as string;
    
    if (!payloadString) {
      return NextResponse.json({ error: 'Missing payload in form-data' }, { status: 400 });
    }

    const { author, title, desc, type, options } = JSON.parse(payloadString);

    // Handle file uploads to Supabase Storage
    const uploadOptions = await Promise.all(
      options.map(async (option: any, idx: number) => {
        let imageUrl = '';
        
        const file = formData.get(`files`) as File;
        if (file && file.size > 0) {
          // Upload to Supabase Storage
          const fileName = `poll-${Date.now()}-${idx}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('poll-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
          } else {
            // Get public URL
            const { data: publicUrlData } = supabase.storage
              .from('poll-images')
              .getPublicUrl(fileName);
            imageUrl = publicUrlData.publicUrl;
          }
        }

        return {
          index: idx + 1,
          title: option.name,
          desc: option.desc,
          vote_count: 0,
          image_url: imageUrl,
        };
      })
    );

    // Insert poll into Supabase database
    const { data: poll, error: insertError } = await supabase
      .from('polls')
      .insert({
        poll_id: Date.now(),
        author,
        title,
        description: desc,
        type,
        options: uploadOptions,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
    }

    console.log('✅ Inserted new poll!', poll.id);
    return NextResponse.json({ pollId: poll.poll_id, ...poll }, { status: 201 });

  } catch (err) {
    console.error('Error creating poll:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: polls, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
    }

    return NextResponse.json(polls);
  } catch (err) {
    console.error('Error fetching polls:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}