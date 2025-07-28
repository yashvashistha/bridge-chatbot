"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import DOMPurify from "dompurify"
import type { ChatFeedbackProps } from "../types/chat-wedgit-types"
import sendFeedback from "../Api/send-feedbcak"
import { Loader } from "lucide-react"

export const ChatFeedback = ({ handleCloseFeedback, handleCloseChat }: ChatFeedbackProps) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [feedbackError, setFeedbackError] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const formBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const closeModal = () => {
    setIsVisible(false)
    setTimeout(() => {
      handleCloseFeedback()
      handleCloseChat()
    }, 300) // Match transition duration
  }

  const handleSubmit = async () => {
    if (rating === 0) return
    setIsSubmitting(true)
    // Validate feedback length
    if (feedback.trim().length < 10) {
      setFeedbackError("Please provide feedback of at least 10 characters")
      setIsSubmitting(false)
      return
    }

    const storedSessionId: string | null = sessionStorage.getItem("chatSessionId")

    const sanitizedFeedback = DOMPurify.sanitize(feedback)
    const res = await sendFeedback(rating, sanitizedFeedback, storedSessionId)
    if (res) {
      setIsSubmitted(true)
    }

    setIsSubmitting(false)
  }

  const handleProvideFeedback = () => {
    setShowFeedbackForm(true)
  }

  useEffect(() => {
    if (showFeedbackForm && formBottomRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      }, 100)
    }
  }, [showFeedbackForm])

  return (
    <div         ref={modalRef}
    className="w-full flex justify-center">
      {/* Modal */}
      <div
        className={`flex flex-col gap-2 items-center justify-center bg-white p-2 pb-0 rounded-xl shadow-xl w-full max-w-[600px] transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
          }`}
      >
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-[#3C3C3C] text-md font-medium mb-2">Thank you for your feedback!</p>
            <p className="text-[#676767] text-base mb-6">
              You rated us {rating} {rating === 1 ? "star" : "stars"}.
            </p>
            <button
              className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] px-6 py-2 rounded-lg text-base text-white hover:opacity-90 transition-opacity"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        ) : !showFeedbackForm ? (
          // Initial prompt asking if user wants to provide feedback
          <div className="text-center w-full">
            <h2 className="text-[#3C3C3C] text-md font-medium mb-4">Would you like to provide feedback?</h2>
            <p className="text-[#676767] text-sm mb-6">
              Your feedback helps us improve our service and better assist you in the future.
            </p>

            <div className="flex items-center w-full gap-2">
              <button
                className="w-full h-full text-[#0C4A4D] bg-white border border-[#0C4A4D] py-3 rounded-lg font-medium text-[14px] transition-all hover:bg-gray-50"
                onClick={closeModal}
                type="button"
              >
                No, thanks
              </button>

              <button
                className="w-full bg-gradient-to-r from-[#0C4A4D] to-[#083032] py-3 rounded-lg text-white font-medium text-[14px] transition-all hover:opacity-90"
                onClick={handleProvideFeedback}
                type="button"
              >
                Yes, provide feedback
              </button>
            </div>
          </div>
        ) : (
          // Full feedback form
          <>
            <h2 className="text-[#3C3C3C] text-md font-medium mb-4">How was your experience?</h2>
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1
                return (
                  <button
                    key={starValue}
                    className={`rounded-full p-2 transition duration-200 ${starValue <= (hoveredRating || rating) ? "bg-yellow-400" : "bg-[#F4F4F4]"
                      }`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Image src="/assets/star.svg" alt="star icon" width={24} height={24} />
                  </button>
                )
              })}
            </div>
            <div className="w-full mb-6">
              {/* <label htmlFor="feedback" className="block text-[#3C3C3C] text-sm font-medium mb-2">
                Tell us more about your experience <span className="text-red-500">*</span>
              </label> */}
              <textarea
                id="feedback"
                className={`w-full p-3 border rounded-xl text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#0C4A4D] focus:border-transparent min-h-[100px] ${feedbackError ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
                placeholder="Your feedback helps us improve... (minimum 10 characters)"
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value)
                  if (e.target.value.trim().length >= 10) {
                    setFeedbackError("")
                  }
                }}
              ></textarea>
              {feedbackError && <p className="mt-1 text-sm text-red-500">{feedbackError}</p>}
            </div>

            <div className="flex items-center w-full gap-2">
              <button
                className="w-full h-full text-[#0C4A4D] bg-white border border-[#0C4A4D] py-2 rounded-lg font-medium text-[14px] transition-all hover:opacity-90"
                onClick={closeModal}
                disabled={isSubmitting}
                type="button"
              >
                Cancel
              </button>

              <button
                className={`w-full bg-gradient-to-r from-[#0C4A4D] to-[#083032] py-2 rounded-lg text-white font-medium text-[14px] transition-all ${rating === 0 || feedback.trim().length < 10 ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
                  }`}
                onClick={handleSubmit}
                disabled={rating === 0 || feedback.trim().length < 10 || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Sending...
                  </span>
                ) : (
                  "Submit Feedback"
                )}
              </button>

            </div>
          </>
        )}
        <div ref={formBottomRef} className="h-1" />

      </div>
    </div>
  )
}