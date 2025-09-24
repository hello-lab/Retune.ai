const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
import { createClient } from "@/lib/supabase/client";
import { auth } from '@clerk/nextjs/server'

const supabase = createClient();
// Get Spotify access token


// Search Spotify tracks based on moods/singers


export async function GET() {
  const { userId } = await auth();
  try {
  
console.log(userId,'hhey');
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("userid", userId ?? "no-user");
  console.log(data);
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}