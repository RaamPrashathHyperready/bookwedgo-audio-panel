import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = "mongodb+srv://fastapi:uHxu5.bHEkW-ECc@clusters0.v1ogl.mongodb.net/"
const DB_NAME = "audio_bookwedgo"
const COLLECTION_NAME = "call_analysis"

export async function GET(request, { params }) {
  const { phoneNumber } = await params
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Convert phoneNumber to number for query
    const phoneNum = Number.parseInt(phoneNumber)

    const calls = await collection
      .find({ "my_key.From": phoneNum })
      .sort({ "my_key.StartTime": -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await collection.countDocuments({ "my_key.From": phoneNum })
    const totalPages = Math.ceil(total / limit)

    await client.close()

    return NextResponse.json({
      calls,
      totalPages,
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching calls:", error)
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 })
  }
}
