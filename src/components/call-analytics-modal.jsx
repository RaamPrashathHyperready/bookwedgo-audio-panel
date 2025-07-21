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
      <DialogContent className="w-[80vw] !max-w-[1400px] max-h-[90vh] overflow-hidden p-3 sm:p-6 flex flex-col">
        <DialogHeader className="pb-2 sm:pb-4 flex-shrink-0">
          <DialogTitle className="text-base sm:text-lg md:text-xl">
            Call Analytics - {my_key.Id}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Detailed analysis of the selected call
          </p>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-2 sm:pr-4">
          <div className="space-y-4 sm:space-y-6">
            {/* Call Information Card - Responsive Grid */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Call Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Direction</p>
                    <p className="text-gray-900 truncate">{my_key.Direction || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Type</p>
                    <p className="text-gray-900 truncate">{my_key.Type || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Exotel Number</p>
                    <p className="text-gray-900 truncate">{my_key.ExotelNumber || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">From</p>
                    <p className="text-gray-900 truncate">{my_key.From || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">From Name</p>
                    <p className="text-gray-900 truncate">{my_key.FromName || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">To</p>
                    <p className="text-gray-900 truncate">{my_key.To || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">To Name</p>
                    <p className="text-gray-900 truncate">{my_key.ToName || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Status</p>
                    <Badge variant="outline" className="text-xs max-w-full">
                      <span className="truncate">{my_key.Status || "N/A"}</span>
                    </Badge>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Start Time</p>
                    <p className="text-gray-900 truncate" title={my_key.StartTime}>
                      {my_key.StartTime || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">End Time</p>
                    <p className="text-gray-900 truncate" title={my_key.EndTime}>
                      {my_key.EndTime || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Price</p>
                    <p className="text-gray-900 truncate">₹{my_key.Price || "0"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Group Name</p>
                    <p className="text-gray-900 truncate">{my_key.GroupName || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">From Circle</p>
                    <p className="text-gray-900 truncate">{my_key.FromCircle || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">To Circle</p>
                    <p className="text-gray-900 truncate">{my_key.ToCircle || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">App Name</p>
                    <p className="text-gray-900 truncate">{my_key.AppName || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-600 truncate">Duration</p>
                    <p className="text-gray-900 truncate">{my_key.ConversationDuration || "0"}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Analytics Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Call Details */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Call Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Source Language</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {gemini_result.call_details?.source_language || "kn-IN"}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Duration</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                      </div>
                      <span className="text-xs sm:text-sm">{my_key.Duration} seconds</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm mb-2">Audio Playback</p>
                    <div className="w-full">
                      <AudioPlayer audioKey={supabase.Key} duration={my_key.Duration} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Overview */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Conversation Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Topic</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                      {gemini_result.conversation_overview?.topic || "Product Inquiry"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Purchase Intent</p>
                    <Badge
                      className={`mt-1 text-xs ${
                        gemini_result.conversation_overview?.purchase_intent === "High"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {gemini_result.conversation_overview?.purchase_intent || "Low"}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Expected Timeline</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                      {gemini_result.conversation_overview?.expected_timeline || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Products Discussed</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                      {gemini_result.conversation_overview?.products_discussed?.length > 0
                        ? gemini_result.conversation_overview.products_discussed.join(", ")
                        : "No products discussed"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Intent */}
              <Card className="lg:col-span-2 xl:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Customer Intent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Stage</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {gemini_result.customer_intent?.stage || "Research"}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Timeline</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                      {gemini_result.customer_intent?.timeline || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Language</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                      {gemini_result.customer_intent?.language || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Feedback */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Key Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Positive Points</p>
                    <div className="mt-2 space-y-1 max-h-20 sm:max-h-24 overflow-y-auto">
                      {safePositivePoints.length > 0 ? (
                        safePositivePoints.map((point, index) => (
                          <div key={index} className="text-xs sm:text-sm text-green-700 break-words">
                            • {typeof point === "string" ? point : "Positive point"}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500">No positive points identified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Concerns</p>
                    <div className="mt-2 space-y-1 max-h-20 sm:max-h-24 overflow-y-auto">
                      {safeConcerns.length > 0 ? (
                        safeConcerns.map((concern, index) => (
                          <div key={index} className="text-xs sm:text-sm text-red-700 break-words">
                            • {typeof concern === "string" ? concern : "Concern"}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500">No concerns identified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Discussion Points */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Key Discussion Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="max-h-32 sm:max-h-36 overflow-y-auto space-y-2">
                    {safeSubSections.length > 0 ? (
                      safeSubSections.map((section, index) => (
                        <div key={index}>
                          <p className="font-medium text-xs sm:text-sm">Sub Section {index + 1}</p>
                          <p className="text-xs sm:text-sm text-gray-600 break-words">
                            {typeof section === "string" ? section : "Sub section"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div>
                        <p className="font-medium text-xs sm:text-sm">Sub Section</p>
                        <p className="text-xs sm:text-sm text-gray-600">Inquiry about online designs</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Topics */}
              <Card className="lg:col-span-2 xl:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Top Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-36 overflow-y-auto">
                    {safeTopTopics.length > 0 ? (
                      safeTopTopics.map((topic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-xs sm:text-sm break-words">
                            {typeof topic === "string" ? topic : "Topic"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-xs sm:text-sm">designs inquiry</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-xs sm:text-sm">online catalog</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {safeActionItems.length > 0 ? (
                      safeActionItems.map((item, index) => (
                        <div key={index} className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-xs sm:text-sm">Action Required</p>
                          <p className="text-xs sm:text-sm text-gray-600 break-words mt-1">
                            {typeof item === "string" ? item : item.description || "Action item"}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            Priority
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">No action items</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Product Information */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="font-medium text-xs sm:text-sm">Product details</p>
                      <div className="max-h-28 sm:max-h-32 overflow-y-auto mt-1">
                        {safeProductInfo.length > 0 ? (
                          safeProductInfo.map((product, index) => (
                            <p key={index} className="text-xs sm:text-sm text-gray-600 break-words">
                              {typeof product === "string" ? product : "Product information"}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-500">No product information available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call Quality */}
              <Card className="lg:col-span-2 xl:col-span-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Call Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Quality Score</p>
                    <div className="text-xl sm:text-2xl font-bold mt-1">
                      {gemini_result.call_quality?.quality_score || 50}%
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-xs sm:text-sm">Issues Detected</p>
                    {safeIssuesDetected.length > 0 ? (
                      <div className="mt-2 space-y-1 max-h-20 sm:max-h-24 overflow-y-auto">
                        {safeIssuesDetected.map((issue, index) => (
                          <div key={index} className="text-xs sm:text-sm text-red-600 break-words">
                            • {typeof issue === "string" ? issue : "Issue detected"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">-</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Translated Conversation - Full Width */}
            {result?.transcript && (
              <Card className="w-full">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                    <span>Translated Conversation</span>
                    <Badge variant="outline" className="text-xs">EN</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 sm:h-40">
                    <div className="space-y-2 text-xs sm:text-sm">
                      {result.diarized_transcript ? (
                        <pre className="whitespace-pre-wrap font-mono text-xs break-words">
                          {result.diarized_transcript}
                        </pre>
                      ) : (
                        <p className="break-words">{result.transcript}</p>
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