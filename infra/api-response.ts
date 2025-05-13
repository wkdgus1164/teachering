"use client"

import type { GlobalResponse } from "@/schema/response-schema"

export const STATUS = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
} as const

export type StatusType = (typeof STATUS)[keyof typeof STATUS]

/**
 * Creates a standardized success response
 * @param data The data to include in the response
 * @param message The Korean message to include
 * @returns A standardized GlobalResponse object
 */
export function createSuccessResponse<T>(data: T, message = "성공적으로 처리되었습니다."): GlobalResponse<T> {
  return {
    status: STATUS.SUCCESS,
    data,
    message,
  }
}

/**
 * Creates a standardized error response
 * @param status The error status code
 * @param message The Korean error message
 * @returns A standardized GlobalResponse object with null data
 */
export function createErrorResponse(
  status: Exclude<StatusType, typeof STATUS.SUCCESS> = STATUS.ERROR,
  message = "오류가 발생했습니다.",
): GlobalResponse<null> {
  return {
    status,
    data: null,
    message,
  }
}

/**
 * Handles API responses and standardizes them
 * @param promise The promise that resolves to the API response
 * @param successMessage Optional success message override
 * @param errorMessage Optional error message override
 * @returns A promise that resolves to a standardized GlobalResponse
 */
export async function handleApiResponse<T>(
  promise: Promise<T>,
  successMessage?: string,
  errorMessage?: string,
): Promise<GlobalResponse<T>> {
  try {
    const data = await promise
    return createSuccessResponse(data, successMessage)
  } catch (error) {
    console.error("API Error:", error)

    // Handle different error types
    if (error instanceof Error) {
      return createErrorResponse(STATUS.ERROR, errorMessage || error.message)
    }

    return createErrorResponse(STATUS.ERROR, errorMessage)
  }
}
