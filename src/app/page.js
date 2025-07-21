import { Suspense } from "react"
import { PhoneNumbersTable } from "@/components/phone-numbers-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Call Analytics Dashboard</CardTitle>
          <CardDescription>View call analytics by customer phone numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
            <PhoneNumbersTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
