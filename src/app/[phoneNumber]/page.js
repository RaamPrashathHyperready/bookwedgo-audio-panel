import { Suspense } from "react"
import { CallDetailsTable } from "@/components/call-details-table"
import { ConversationFlowchart } from "@/components/conversation-flowchart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function PhoneNumberPage({ params }) {
  const { phoneNumber } = await params

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Call Details for {phoneNumber}</CardTitle>
            <CardDescription>All calls and analytics for this customer</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="flex justify-center p-8">Loading calls...</div>}>
              <CallDetailsTable phoneNumber={phoneNumber} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Conversation Flowchart */}
        <div className="mt-6">
          <ConversationFlowchart phoneNumber={phoneNumber} />
        </div>
      </div>
    </div>
  )
}
