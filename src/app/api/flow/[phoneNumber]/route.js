import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = "mongodb+srv://fastapi:uHxu5.bHEkW-ECc@clusters0.v1ogl.mongodb.net/"
const DB_NAME = "audio_bookwedgo"
const COLLECTION_NAME = "call_flow"

export async function GET(request, { params }) {
  const { phoneNumber } = await params

  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    const phoneNum = Number.parseInt(phoneNumber)
    const flowData = await collection.findOne({ "my_key.number": phoneNum })

    await client.close()

    if (!flowData) {
      return NextResponse.json({ flow: [] })
    }

    return NextResponse.json({ flow: flowData.my_key.flow || [] })
  } catch (error) {
    console.error("Error fetching flow data:", error)
    return NextResponse.json({ error: "Failed to fetch flow data" }, { status: 500 })
  }
}
