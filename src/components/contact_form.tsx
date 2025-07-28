'use client'

import { useState, useRef, useEffect } from 'react'
import { CheckCircle, Loader } from 'lucide-react'
import sendContact from '../Api/send-contact'
import DOMPurify from "dompurify"
import { ChatContactProps } from '../types/chat-wedgit-types'

interface FormData {
    name: string
    email: string
    subject: string
    message: string
    phone: string
}

interface FormErrors {
    name?: string
    email?: string
    subject?: string
    message?: string
    phone?: string
}

export default function ContactForm({ handleCloseContact, isSmallScreen }: ChatContactProps) {
    const [isVisible, setIsVisible] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: ''
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')


    useEffect(() => {
        // Add animation after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 50)

        // Handle click outside to close
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            clearTimeout(timer)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const closeModal = () => {
        setIsVisible(false)
        setTimeout(() => {
            if (submitStatus === 'success') {
                setSubmitStatus('idle')
            }
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                phone: ''
            })
            handleCloseContact()
        }, 300)
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required'
        } else if (formData.subject.trim().length < 5) {
            newErrors.subject = 'Subject must be at least 5 characters'
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required'
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters'
        }

        if (formData.phone.trim() && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: DOMPurify.sanitize(value)
        }))

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const res = await sendContact(formData)

            if (res) {
                setSubmitStatus('success')
            } else {
                setSubmitStatus('error')
            }
        } catch (error) {
            setSubmitStatus('error')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="w-full flex justify-center">

                <div className="flex items-center justify-center px-4">
                    <div
                        // ref={modalRef}
                        className={`flex flex-col gap-2 items-center justify-center bg-white p-2 rounded-xl shadow-xl w-full max-w-[600px] transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}`}
                    >
                        <div>
                            {submitStatus !== "success" &&
                                <h2 id="modal-title" className="text-[#3C3C3C] text-xl font-medium">
                                    Contact Us
                                </h2>
                            }

                            {/* <p className="text-gray-600 mb-6">
                                Fill out the form below and we&apos;ll get back to you as soon as possible.
                            </p> */}

                            {submitStatus === 'success' ? (
                                <div className="text-center py-2">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-500 mb-6">
                                        Thank you for reaching out. We&apos;ll get back to you shortly.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] px-6 py-2 rounded-lg text-base text-white hover:opacity-90 transition-opacity"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className={`grid ${isSmallScreen ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                                    <div>
                                        <label htmlFor="name" className="block text-start text-sm font-medium text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                            autoFocus
                                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C4A4D] focus:border-[#0C4A4D] ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-start text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C4A4D] focus:border-[#0C4A4D] ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-start text-sm font-medium text-gray-700 mb-1">
                                            Phone Number <span className="text-gray-400 text-sm">(Optional)</span>
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (123) 456-7890"
                                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C4A4D] focus:border-[#0C4A4D] ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-start text-sm font-medium text-gray-700 mb-1">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What is this regarding?"
                                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C4A4D] focus:border-[#0C4A4D] ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                        )}
                                    </div>

                                    <div className={`${isSmallScreen ? "" : "col-span-2 "}`}>
                                        <label htmlFor="message" className="block text-start text-sm font-medium text-gray-700 mb-1">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Your message here..."
                                            rows={3}
                                            className={`w-full text-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C4A4D] focus:border-[#0C4A4D] ${errors.message ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                        )}
                                    </div>

                                    {submitStatus === 'error' && (
                                        <div className={`p-3 bg-red-50 border border-red-200 rounded-md ${isSmallScreen ? "" : "col-span-2 "}`}>
                                            <p className="text-sm text-red-600">
                                                There was an error sending your message. Please try again later.
                                            </p>
                                        </div>
                                    )}

                                    <div className={`flex items-cetner w-full gap-2 ${isSmallScreen ? "" : "col-span-2 "}`}>
                                        <button
                                            className={`w-full h-full text-[#0C4A4D] bg-white border border-[#0C4A4D] rounded-lg font-medium text-[14px] transition-all ${isSubmitting ? "cursor-not-allowed opacity-50" : "hover:opacity-90"}`}
                                            onClick={closeModal}
                                            disabled={isSubmitting}
                                            type='button'
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className={` w-full bg-gradient-to-r from-[#0C4A4D] to-[#083032] py-2 rounded-lg text-white text-[14px] font-medium transition-all ${isSubmitting ? "cursor-not-allowed opacity-50" : "hover:opacity-90"}`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </div>

                                </form>
                            )}
                        </div>

                        {/* <div className="px-6 py-4 text-center text-sm text-gray-500 rounded-b-lg">
                            We respect your privacy and will never share your information.
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}