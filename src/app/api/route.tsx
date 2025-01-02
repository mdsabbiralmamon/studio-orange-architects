import { NextResponse } from "next/server";

/**
 * Handles GET requests to check the status of the Studio Orange Architects API.
 */
export async function GET() {
  try {
    // Get current time in GMT+6 (Bangladesh Standard Time) formatted as HH:mm:ss
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",  // Time zone set to GMT+6
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, 
    });

    // Respond with a successful status and the current time
    return NextResponse.json(
      {
        serverStatus: "OK",  // Indicates the API is active
        timestamp: currentTime,  // Local GMT+6 time in HH:mm:ss format
      },
      { status: 200 }  // HTTP 200 for success
    );
  } catch (error) {
    // Log error details for debugging
    console.error("Error handling GET request:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace available",
    });

    // Get current time in GMT+6 for error response
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",  // Time zone set to GMT+6
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,  // Use 24-hour time format
    });

    // Return an error response with status 500
    return NextResponse.json(
      {
        serverStatus: "Error",  // Indicates a failure
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
        timestamp: currentTime,  // Local GMT+6 time in HH:mm:ss format
      },
      { status: 500 }  // HTTP 500 for internal server error
    );
  }
}
