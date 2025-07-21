"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"
import { CallAnalyticsModal } from "@/components/call-analytics-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function CallDetailsTable({ phoneNumber }) {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCall, setSelectedCall] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchCalls()
  }, [phoneNumber, currentPage])

  const fetchCalls = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/calls/${phoneNumber}?page=${currentPage}&limit=10`)
      const data = await response.json()
      setCalls(data.calls)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching calls:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewAnalytics = (call) => {
    setSelectedCall(call)
    setModalOpen(true)
  }

  const getIntentBadgeColor = (intent) => {
    switch (intent.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getQualityColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-gray-500">Loading calls...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Number</TableHead>
              <TableHead>Products Discussed</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead>Expected Timeline</TableHead>
              <TableHead>Call Quality</TableHead>
              <TableHead>Conversation Topic</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call._id}>
                <TableCell>
                  <div className="space-y-2">
                    <div className="font-medium">{call.my_key.From}</div>
                    <div className="text-sm text-gray-500">{call.my_key.StartTime}</div>
                    <AudioPlayer audioKey={call.my_key.supabase.Key} duration={call.my_key.Duration} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {call.my_key.gemini_result.conversation_overview.products_discussed &&
                    call.my_key.gemini_result.conversation_overview.products_discussed.length > 0 ? (
                      call.my_key.gemini_result.conversation_overview.products_discussed
                        .slice(0, 2)
                        .map((product, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {typeof product === "string" ? product : "Product"}
                          </Badge>
                        ))
                    ) : (
                      <span className="text-sm text-gray-500">No products discussed</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={getIntentBadgeColor(
                      call.my_key.gemini_result.conversation_overview.purchase_intent || "low",
                    )}
                  >
                    {call.my_key.gemini_result.conversation_overview.purchase_intent || "Low"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {call.my_key.gemini_result.conversation_overview.expected_timeline || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div
                      className={`font-medium ${getQualityColor(call.my_key.gemini_result.call_quality.quality_score || 0)}`}
                    >
                      {call.my_key.gemini_result.call_quality.quality_score || 0}%
                    </div>
                    {call.my_key.gemini_result.call_quality.issues_detected &&
                      call.my_key.gemini_result.call_quality.issues_detected.length > 0 && (
                        <div className="text-xs text-red-600">
                          {call.my_key.gemini_result.call_quality.issues_detected.length} issue(s)
                        </div>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-sm">
                      {call.my_key.gemini_result.conversation_overview.topic || "General Inquiry"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Stage: {call.my_key.gemini_result.customer_intent.stage || "Unknown"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleViewAnalytics(call)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CallAnalyticsModal call={selectedCall} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
