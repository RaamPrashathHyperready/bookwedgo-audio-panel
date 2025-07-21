import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://egkvjgyrmjoxaetjnnsc.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVna3ZqZ3lybWpveGFldGpubnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzg5MDUsImV4cCI6MjA2ODUxNDkwNX0.3vX9Hjhl8D7RXfj6AwNrYQV3c-LwkRC8C5ZwjC3DVzE"

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request, { params }) {
  try {
    const { audioKey } = await params
    const fullAudioKey = audioKey.join("/")

    const { data, error } = await supabase.storage
      .from("bookwedgobucket")
      .download(fullAudioKey.replace("bookwedgobucket/", ""))

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch audio file" }, { status: 404 })
    }

    if (!data) {
      return NextResponse.json({ error: "Audio file not found" }, { status: 404 })
    }

    // Return the audio file with appropriate headers
    return new NextResponse(data, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching audio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
