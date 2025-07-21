import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = "mongodb+srv://fastapi:uHxu5.bHEkW-ECc@clusters0.v1ogl.mongodb.net/"
const DB_NAME = "audio_bookwedgo"
const COLLECTION_NAME = "call_analysis"

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Get unique phone numbers with aggregation
    const pipeline = [
      {
        $group: {
          _id: "$my_key.From",
          callCount: { $sum: 1 },
          topicsDiscussed: {
            $addToSet: {
              $cond: {
                if: { $gt: [{ $size: "$my_key.gemini_result.top_topics" }, 0] },
                then: { $arrayElemAt: ["$my_key.gemini_result.top_topics", 0] },
                else: "General Inquiry",
              },
            },
          },
        },
      },
      {
        $project: {
          phoneNumber: "$_id",
          callCount: 1,
          topicsDiscussed: 1,
          _id: 0,
        },
      },
      { $sort: { callCount: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]

    const phoneNumbers = await collection.aggregate(pipeline).toArray()

    // Get total count for pagination
    const totalPipeline = [
      {
        $group: {
          _id: "$my_key.From",
        },
      },
      {
        $count: "total",
      },
    ]

    const totalResult = await collection.aggregate(totalPipeline).toArray()
    const total = totalResult[0]?.total || 0
    const totalPages = Math.ceil(total / limit)

    await client.close()

    return NextResponse.json({
      phoneNumbers,
      totalPages,
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching phone numbers:", error)
    return NextResponse.json({ error: "Failed to fetch phone numbers" }, { status: 500 })
  }
}
