"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ConversationFlowchart({ phoneNumber }) {
  const [flowData, setFlowData] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    fetchFlowData()
  }, [phoneNumber])

  const fetchFlowData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/flow/${phoneNumber}`)
      const data = await response.json()
      setFlowData(data.flow || [])
    } catch (error) {
      console.error("Error fetching flow data:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasDetails = (details) => {
    return details && Object.keys(details).length > 0
  }

  const formatDetails = (details) => {
    if (!hasDetails(details)) return "No details"
    return Object.entries(details)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join("\n")
  }

  if (loading) {
    return (
      <Card className="w-full bg-white border-gray-200">
        <CardContent className="p-12">
          <div className="flex justify-center items-center">
            <div className="rounded-full h-8 w-8 border-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading conversation flow...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (flowData.length === 0) {
    return (
      <Card className="w-full bg-white border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-gray-900">Conversation Flow</CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <div className="text-center text-gray-500">No conversation flow data available for this phone number.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white border-gray-200">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-gray-900 text-xl">Conversation Flow</CardTitle>
        <p className="text-gray-600 text-sm">Timeline of conversation topics</p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="relative">
          {/* Main flow container */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto overflow-y-visible pb-8 min-h-[120px] relative" style={{ paddingBottom: '120px' }}>
            {flowData.map((step, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                {/* Flow step node */}
                <div
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Main circle */}
                  <div
                    className={`
                      relative w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer
                      ${
                        hoveredIndex === index
                          ? "bg-blue-500 border-blue-500"
                          : "bg-gray-100 border-gray-300"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-sm font-bold
                        ${hoveredIndex === index ? "text-white" : "text-gray-700"}
                      `}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Topic label */}
                  <div className="mt-4 text-center max-w-28">
                    <p
                      className={`
                        text-xs font-medium leading-tight
                        ${hoveredIndex === index ? "text-blue-600" : "text-gray-600"}
                      `}
                    >
                      {step.topic}
                    </p>
                  </div>

                  {/* Hover details tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-50 mt-2">
                      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-xl min-w-64 max-w-80">
                        <div className="text-blue-600 font-semibold text-sm mb-2 border-b border-gray-200 pb-2">
                          {step.topic}
                        </div>
                        <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{formatDetails(step.details)}</div>
                        {/* Tooltip arrow */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-4 h-4 bg-white border-l border-t border-gray-300 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connecting line between nodes */}
                {index < flowData.length - 1 && (
                  <div className="flex items-center mx-3 self-start mt-8">
                    <div
                      className={`
                        h-1 w-12 rounded-full
                        ${
                          hoveredIndex === index || hoveredIndex === index + 1
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }
                      `}
                    />
                    {/* Arrow */}
                    <div
                      className={`
                        w-0 h-0 border-l-4 border-r-0 border-t-2 border-b-2 border-transparent ml-1
                        ${
                          hoveredIndex === index || hoveredIndex === index + 1
                            ? "border-l-blue-500"
                            : "border-l-gray-300"
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Flow summary */}
          {/* <div className="mt-6 flex flex-wrap gap-3 justify-center items-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-gray-600 text-xs">Total Steps:</span>
              <span className="text-blue-600 font-semibold ml-2">{flowData.length}</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-gray-600 text-xs">Phone Number:</span>
              <span className="text-blue-600 font-semibold ml-2">{phoneNumber}</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-gray-600 text-xs">Status:</span>
              <span className="text-green-600 font-semibold ml-2">Complete</span>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}