/**
 * Checks if code is running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Copies text to clipboard using the most appropriate available method
 * @param text The text to copy to clipboard
 * @returns A promise that resolves to true if copying was successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Only run in browser environment
  if (!isBrowser()) return false

  // Try using the Clipboard API first (modern browsers)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error("Clipboard API failed:", err)
      // Fall through to legacy method
    }
  }

  // Fallback for older browsers
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text

    // Make the textarea out of viewport
    textarea.style.position = "fixed"
    textarea.style.left = "-999999px"
    textarea.style.top = "-999999px"

    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    const successful = document.execCommand("copy")
    document.body.removeChild(textarea)

    return successful
  } catch (err) {
    console.error("Legacy clipboard method failed:", err)
    return false
  }
}
