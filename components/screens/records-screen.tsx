"use client"
import { useState, useEffect, useRef } from "react"
import { SearchFilterBar } from "@/components/ui/search-filter-bar"
import { Icon } from '@/components/ui/icon'
import { ScreenHeader } from "@/components/ui/screen-header"

interface Document {
  id: string
  name: string
  type: "discharge" | "prescription" | "lab-test"
  fileType: string
  uploadDate: string
  size: string
  status: "uploaded" | "pending" | "processing"
  verificationStatus: "verified" | "rejected" | "in-progress"
  result?: string
  testStatus?: "normal" | "abnormal" | "pending"
  summary?: string
  showSummary?: boolean
}

const DOCUMENT_TYPES = ["All", "Discharge Summary", "Prescription", "Lab Test"]

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Discharge Summary - Cardiac Surgery",
    type: "discharge",
    fileType: "PDF",
    uploadDate: "2024-01-20",
    size: "2.3 MB",
    status: "uploaded",
    verificationStatus: "verified",
  },
  {
    id: "2",
    name: "Complete Blood Count (CBC)",
    type: "lab-test",
    fileType: "PDF",
    uploadDate: "2024-01-18",
    size: "1.2 MB",
    status: "uploaded",
    verificationStatus: "verified",
    result: "Normal",
    testStatus: "normal",
  },
  {
    id: "3",
    name: "Prescription - Cardiac Medications",
    type: "prescription",
    fileType: "PDF",
    uploadDate: "2024-01-15",
    size: "0.8 MB",
    status: "uploaded",
    verificationStatus: "verified",
  },
  {
    id: "4",
    name: "Liver Function Test",
    type: "lab-test",
    fileType: "PDF",
    uploadDate: "2024-01-12",
    size: "1.1 MB",
    status: "uploaded",
    verificationStatus: "in-progress",
    result: "Slightly Elevated",
    testStatus: "abnormal",
  },
  {
    id: "5",
    name: "Discharge Summary - Emergency Visit",
    type: "discharge",
    fileType: "PDF",
    uploadDate: "2024-01-10",
    size: "1.8 MB",
    status: "uploaded",
    verificationStatus: "rejected",
  },
  {
    id: "6",
    name: "Lipid Profile",
    type: "lab-test",
    fileType: "PDF",
    uploadDate: "2024-01-08",
    size: "0.9 MB",
    status: "uploaded",
    verificationStatus: "verified",
    result: "Good",
    testStatus: "normal",
  },
]

export function RecordsScreen({ onBack }: { onBack?: () => void }) {
  const [documents, setDocuments] = useState<Document[]>(SAMPLE_DOCUMENTS)
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [expandingDocId, setExpandingDocId] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Simple filtering state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["All"])

  // Filter documents based on search and selected filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      selectedFilters.includes("All") ||
      selectedFilters.some((filter) => {
        switch (filter) {
          case "Discharge Summary":
            return doc.type === "discharge"
          case "Prescription":
            return doc.type === "prescription"
          case "Lab Test":
            return doc.type === "lab-test"
          default:
            return true
        }
      })

    return matchesSearch && matchesFilter
  })

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterToggle = (filter: string) => {
    if (filter === "All") {
      setSelectedFilters(["All"])
    } else {
      setSelectedFilters((prev) => {
        const newFilters = prev.filter((f) => f !== "All")
        if (newFilters.includes(filter)) {
          const filtered = newFilters.filter((f) => f !== filter)
          return filtered.length === 0 ? ["All"] : filtered
        } else {
          return [...newFilters, filter]
        }
      })
    }
  }

  const handleFileUpload = (documentType: string) => {
    console.log(`Uploading ${documentType} file`)
    setShowUploadOptions(false)
    // Here you would implement actual file upload logic
  }

  const generateAISummary = async (docId: string) => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop)
    }

    setLoadingSummary(docId)
    setExpandingDocId(docId)

    // Simulate AI summary generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const summaries: Record<string, string> = {
      "2": "**Blood Count Analysis**: Your CBC results show healthy levels across all parameters. White blood cell count is within normal range indicating good immune function. Red blood cell and hemoglobin levels suggest adequate oxygen transport. Platelet count is optimal for proper blood clotting.",
      "4": "**Liver Function Assessment**: Slightly elevated liver enzymes (ALT: 45 U/L, AST: 38 U/L) may indicate mild liver stress. This could be due to recent medication, alcohol consumption, or dietary factors. **Recommendation**: Follow up in 4-6 weeks, maintain healthy diet, limit alcohol intake.",
      "6": "**Lipid Profile Review**: Excellent lipid profile with total cholesterol at 180 mg/dL, LDL at 95 mg/dL, and HDL at 65 mg/dL. Your cardiovascular risk profile is low. **Recommendation**: Continue current lifestyle and dietary habits.",
    }

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              summary:
                summaries[docId] || "Analysis complete. Consult your healthcare provider for detailed interpretation.",
              showSummary: true,
            }
          : doc,
      ),
    )
    setLoadingSummary(null)
    setExpandingDocId(null)
  }

  const dismissSummary = (docId: string) => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop)
    }

    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, showSummary: false } : doc)))

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, scrollPosition - 100),
          behavior: "smooth",
        })
      }
    })
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "discharge":
        return <Icon name="fileText" className="w-5 h-5 text-blue-600" />
      case "prescription":
        return <Icon name="medication" className="w-5 h-5 text-green-600" />
      case "lab-test":
        return <Icon name="science" className="w-5 h-5 text-purple-600" />
      default:
        return <Icon name="fileText" className="w-5 h-5 text-[var(--ds-text-secondary)]" />
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "discharge":
        return "Discharge"
      case "prescription":
        return "Prescription"
      case "lab-test":
        return "Lab Test"
      default:
        return "Document"
    }
  }

  const getVerificationStatusConfig = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: (props: any) => <Icon name="checkCircle" {...props} />,
          text: "✓",
          className: "text-green-600 bg-green-50 border border-green-200",
        }
      case "rejected":
        return {
          icon: (props: any) => <Icon name="cancel" {...props} />,
          text: "✗",
          className: "text-red-600 bg-red-50 border border-red-200",
        }
      case "in-progress":
        return {
          icon: (props: any) => <Icon name="clock" {...props} />,
          text: "⏳",
          className: "text-orange-600 bg-orange-50 border border-orange-200",
        }
      default:
        return {
          icon: (props: any) => <Icon name="clock" {...props} />,
          text: "⏳",
          className: "text-[var(--ds-text-secondary)] bg-gray-50 border border-[var(--ds-border-default)]",
        }
    }
  }

  const renderDocumentCard = (doc: Document) => {
    const verificationConfig = getVerificationStatusConfig(doc.verificationStatus)
    const isLabTest = doc.type === "lab-test"

    return (
      <div key={doc.id} className="space-y-2">
        <div className="bg-[var(--ds-surface-primary)] rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-4">
            {/* Header Row - Icon, Title, Status */}
            <div className="flex items-start gap-3 mb-3">
              {/* Document Icon */}
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                {getDocumentIcon(doc.type)}
              </div>

              {/* Title and Type */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 leading-5 mb-1 pr-2">{doc.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">
                    {getDocumentTypeLabel(doc.type)}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${verificationConfig.className}`}
                >
                  <span className="text-sm font-bold">{verificationConfig.text}</span>
                </div>
              </div>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-3 text-xs text-[var(--ds-text-secondary)] mb-2">
              <div className="flex items-center gap-1">
                <Icon name="calendar" className="w-3 h-3" />
                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span>{doc.size}</span>
            </div>

            {/* Lab Result Row with AI Button (if applicable) */}
            {isLabTest && doc.result && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--ds-text-secondary)]">Result:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      doc.testStatus === "normal"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : doc.testStatus === "abnormal"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-gray-50 text-gray-700 border border-[var(--ds-border-default)]"
                    }`}
                  >
                    {doc.result}
                  </span>
                </div>

                <button
                  className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                  onClick={() => generateAISummary(doc.id)}
                  disabled={loadingSummary === doc.id || doc.showSummary}
                  title="Generate AI Summary"
                >
                  <Icon name="sparkles" className="w-3.5 h-3.5 text-[var(--ds-text-inverse)]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary Expansion */}
        {isLabTest && (doc.showSummary || loadingSummary === doc.id) && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 transform transition-all duration-300 ease-out">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="sparkles" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-purple-800">AI Lab Insights</h4>
                  <p className="text-xs text-purple-600">{doc.name}</p>
                </div>
              </div>
              {doc.showSummary && (
                <button
                  onClick={() => dismissSummary(doc.id)}
                  className="p-1 hover:bg-purple-100 rounded-full transition-colors flex-shrink-0"
                >
                  <Icon name="close" className="w-3 h-3 text-purple-600" />
                </button>
              )}
            </div>

            {loadingSummary === doc.id ? (
              <div className="flex items-center justify-center py-6">
                <div className="text-center">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-purple-700">Analyzing lab results...</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: doc.summary?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") || "",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Handle smooth scroll adjustments when content changes
  useEffect(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    let rafId: number

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        container.style.scrollBehavior = "smooth"
      })
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          requestAnimationFrame(() => {
            if (expandingDocId && scrollPosition > 0) {
              container.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
              })
            }
          })
        }
      }
    })

    resizeObserver.observe(container)
    container.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      container.removeEventListener("scroll", handleScroll)
    }
  }, [expandingDocId, scrollPosition])

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      <ScreenHeader title="Medical Records" onBack={onBack} />

      {/* Search and Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={DOCUMENT_TYPES}
        selectedFilters={selectedFilters}
        onFilterToggle={handleFilterToggle}
      />

      {/* Documents List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        <div className="p-4 space-y-4 pb-24">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => renderDocumentCard(doc))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="fileText" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-base text-gray-800 mb-2">No Documents Found</h3>
              <p className="text-sm text-[var(--ds-text-secondary)] max-w-sm leading-relaxed">
                {searchQuery || selectedFilters.length > 1
                  ? "Try adjusting your search or filters to find what you're looking for"
                  : "Upload your medical documents to get started with organizing your health records"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Upload Button */}
      <div className="absolute bottom-20 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <Icon name="plus" className={`w-6 h-6 text-[var(--ds-text-inverse)] transition-transform duration-200 ${showUploadOptions ? "rotate-45" : ""}`}
            />
          </button>

          {/* Upload Options Menu */}
          {showUploadOptions && (
            <div className="absolute bottom-16 right-0 mb-2 bg-[var(--ds-surface-primary)] border border-[var(--ds-border-default)] rounded-xl shadow-xl min-w-48 overflow-hidden">
              <div className="py-2">
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--ds-surface-secondary)] flex items-center gap-3 transition-colors"
                  onClick={() => handleFileUpload("discharge")}
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon name="fileText" className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Discharge Summary</span>
                </button>
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--ds-surface-secondary)] flex items-center gap-3 transition-colors"
                  onClick={() => handleFileUpload("prescription")}
                >
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Icon name="medication" className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Prescription</span>
                </button>
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--ds-surface-secondary)] flex items-center gap-3 transition-colors"
                  onClick={() => handleFileUpload("lab-test")}
                >
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Icon name="science" className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">Lab Test</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close upload menu */}
      {showUploadOptions && <div className="fixed inset-0 z-0" onClick={() => setShowUploadOptions(false)} />}
    </div>
  )
}
