"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PhoneNumbersTable() {
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()

  useEffect(() => {
    fetchPhoneNumbers()
  }, [currentPage, pageSize])

  const fetchPhoneNumbers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/phone-numbers?page=${currentPage}&limit=${pageSize}`)
      const data = await response.json()
      setPhoneNumbers(data.phoneNumbers)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching phone numbers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (phoneNumber) => {
    router.push(`/${phoneNumber}`)
  }

  // Calculate dynamic page range for three pages (current, prev, next)
  const getPageRange = () => {
    const pages = []
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) {
        pages.push(i)
      }
    }
    return pages
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-gray-500">Loading phone numbers...</p>
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
              <TableHead>Phone Number</TableHead>
              <TableHead>Topics Discussed</TableHead>
              <TableHead>Total Calls</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phoneNumbers.map((item) => (
              <TableRow key={item.phoneNumber}>
                <TableCell className="font-medium">{item.phoneNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.topicsDiscussed &&
                      item.topicsDiscussed.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                          {typeof topic === "string" ? topic : "Topic"}
                        </span>
                      ))}
                    {item.topicsDiscussed && item.topicsDiscussed.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.topicsDiscussed.length - 3} more</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.callCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(item.phoneNumber)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pagination */}
          <Pagination className= "justify-end">
            <PaginationContent className="justify-start">
              {/* Previous Button */}
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

              {/* Page Numbers */}
              {getPageRange().map((page) => (
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
              ))}

              {/* Next Button */}
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
        </div>
      )}
    </div>
  )
}