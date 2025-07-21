"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AudioPlayer } from "@/components/audio-player"

export function CallAnalyticsModal({ call, open, onOpenChange }) {
  if (!call) return null

  const { my_key } = call
  const { gemini_result, supabase, result } = my_key

  // Add safety checks for arrays and objects
  const safeActionItems = Array.isArray(gemini_result.action_items) ? gemini_result.action_items : []
  const safeIssuesDetected = Array.isArray(gemini_result.call_quality?.issues_detected)
    ? gemini_result.call_quality.issues_detected
    : []
  const safePositivePoints = Array.isArray(gemini_result.sentiment_analysis?.key_feedback?.positive_points)
    ? gemini_result.sentiment_analysis.key_feedback.positive_points
    : []
  const safeConcerns = Array.isArray(gemini_result.sentiment_analysis?.key_feedback?.concerns)
    ? gemini_result.sentiment_analysis.key_feedback.concerns
    : []
  const safeSubSections = Array.isArray(gemini_result.sub_sections) ? gemini_result.sub_sections : []
  const safeTopTopics = Array.isArray(gemini_result.top_topics) ? gemini_result.top_topics : []
  const safeProductInfo = Array.isArray(gemini_result.product_info) ? gemini_result.product_info : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] !max-w-[1400px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Call Analytics - {my_key.Id}</DialogTitle>
          <p className="text-sm text-muted-foreground">Detailed analysis of the selected call</p>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Additional Call Information - Horizontal Layout */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Direction</p>
                    <p className="text-gray-900">{my_key.Direction || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Type</p>
                    <p className="text-gray-900">{my_key.Type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Exotel Number</p>
                    <p className="text-gray-900">{my_key.ExotelNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">From</p>
                    <p className="text-gray-900">{my_key.From || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">From Name</p>
                    <p className="text-gray-900">{my_key.FromName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">To</p>
                    <p className="text-gray-900">{my_key.To || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">To Name</p>
                    <p className="text-gray-900">{my_key.ToName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Status</p>
                    <Badge variant="outline" className="text-xs">
                      {my_key.Status || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Start Time</p>
                    <p className="text-gray-900">{my_key.StartTime || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">End Time</p>
                    <p className="text-gray-900">{my_key.EndTime || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Price</p>
                    <p className="text-gray-900">₹{my_key.Price || "0"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Group Name</p>
                    <p className="text-gray-900">{my_key.GroupName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">From Circle</p>
                    <p className="text-gray-900">{my_key.FromCircle || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">To Circle</p>
                    <p className="text-gray-900">{my_key.ToCircle || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">App Name</p>
                    <p className="text-gray-900">{my_key.AppName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Conversation Duration</p>
                    <p className="text-gray-900">{my_key.ConversationDuration || "0"}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3x3 Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              {/* Call Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Call Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-sm">Source Language</p>
                    <Badge variant="outline" className="mt-1">
                      {gemini_result.call_details?.source_language || "kn-IN"}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Duration</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="text-sm">{my_key.Duration} seconds</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-2">Audio Playback</p>
                    <AudioPlayer audioKey={supabase.Key} duration={my_key.Duration} />
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-sm">Topic</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {gemini_result.conversation_overview?.topic || "Product Inquiry"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Purchase Intent</p>
                    <Badge
                      className={`mt-1 ${
                        gemini_result.conversation_overview?.purchase_intent === "High"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {gemini_result.conversation_overview?.purchase_intent || "Low"}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Expected Timeline</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {gemini_result.conversation_overview?.expected_timeline || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Products Discussed</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {gemini_result.conversation_overview?.products_discussed?.length > 0
                        ? gemini_result.conversation_overview.products_discussed.join(", ")
                        : "No products discussed"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Intent */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Intent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-sm">Stage</p>
                    <Badge variant="outline" className="mt-1">
                      {gemini_result.customer_intent?.stage || "Research"}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Timeline</p>
                    <p className="text-sm text-gray-600 mt-1">{gemini_result.customer_intent?.timeline || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Language</p>
                    <p className="text-sm text-gray-600 mt-1">{gemini_result.customer_intent?.language || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Row 2 */}
              {/* Key Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-sm">Positive Points</p>
                    <div className="mt-2 space-y-1">
                      {safePositivePoints.length > 0 ? (
                        safePositivePoints.map((point, index) => (
                          <div key={index} className="text-sm text-green-700">
                            • {typeof point === "string" ? point : "Positive point"}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No positive points identified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Concerns</p>
                    <div className="mt-2 space-y-1">
                      {safeConcerns.length > 0 ? (
                        safeConcerns.map((concern, index) => (
                          <div key={index} className="text-sm text-red-700">
                            • {typeof concern === "string" ? concern : "Concern"}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No concerns identified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Discussion Points */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Discussion Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {safeSubSections.length > 0 ? (
                    safeSubSections.map((section, index) => (
                      <div key={index}>
                        <p className="font-medium text-sm">Sub Section</p>
                        <p className="text-sm text-gray-600">{typeof section === "string" ? section : "Sub section"}</p>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p className="font-medium text-sm">Sub Section</p>
                      <p className="text-sm text-gray-600">Inquiry about online designs</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {safeTopTopics.length > 0 ? (
                    safeTopTopics.map((topic, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">{typeof topic === "string" ? topic : "Topic"}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">designs inquiry</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">online catalog</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Row 3 */}
              {/* Action Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {safeActionItems.length > 0 ? (
                    safeActionItems.map((item, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-sm">Action Required</p>
                        <p className="text-sm text-gray-600">
                          {typeof item === "string" ? item : item.description || "Action item"}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          Priority
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No action items</p>
                  )}
                </CardContent>
              </Card>

              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Product details</p>
                    {safeProductInfo.length > 0 ? (
                      safeProductInfo.map((product, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {typeof product === "string" ? product : "Product information"}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No product information available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Call Quality */}
              <Card>
                <CardHeader>
                  <CardTitle>Call Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-sm">Quality Score</p>
                    <div className="text-2xl font-bold mt-1">{gemini_result.call_quality?.quality_score || 50}%</div>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Issues Detected</p>
                    {safeIssuesDetected.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {safeIssuesDetected.map((issue, index) => (
                          <div key={index} className="text-sm text-red-600">
                            • {typeof issue === "string" ? issue : "Issue detected"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">-</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Translated Conversation */}
            {result?.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Translated Conversation
                    <Badge variant="outline">EN</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <div className="space-y-2 text-sm">
                      {result.diarized_transcript ? (
                        <pre className="whitespace-pre-wrap font-mono text-xs">{result.diarized_transcript}</pre>
                      ) : (
                        <p>{result.transcript}</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
