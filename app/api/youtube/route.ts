import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ error: "YouTube API Key or Channel ID missing" }, { status: 500 });
  }

  try {
    // 1. Get the uploads playlist ID for the channel
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();

    if (channelData.error) {
      console.error("YouTube API Error (Channel):", channelData.error);
      return NextResponse.json({ error: channelData.error.message }, { status: channelData.error.code || 500 });
    }

    if (!channelData.items || channelData.items.length === 0) {
      // Fallback: If channel ID lookup fails, try searching for the channel or using it directly in playlistItems if it's already an uploads ID
      console.log("Channel not found by ID, attempting direct playlist fetch with UC->UU conversion");
      const uploadsPlaylistId = CHANNEL_ID.startsWith('UC') 
        ? 'UU' + CHANNEL_ID.substring(2) 
        : CHANNEL_ID;
      
      return fetchVideosFromPlaylist(uploadsPlaylistId, API_KEY);
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    return fetchVideosFromPlaylist(uploadsPlaylistId, API_KEY);
  } catch (error) {
    console.error("YouTube API Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function fetchVideosFromPlaylist(playlistId: string, apiKey: string) {
  try {
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=10&playlistId=${playlistId}&key=${apiKey}`
    );
    const videosData = await videosRes.json();

    if (videosData.error) {
      console.error("YouTube API Error (Playlist):", videosData.error);
      return NextResponse.json({ error: videosData.error.message }, { status: videosData.error.code || 500 });
    }

    const videos = (videosData.items || []).map((item: any) => ({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`
    }));

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos from playlist" }, { status: 500 });
  }
}
