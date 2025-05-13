"use client"

import { useEffect, useState } from "react"

interface MarkdownProps {
  content: string
  className?: string
  preview?: boolean
}

export function Markdown({ content, className = "", preview = false }: MarkdownProps) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    // In a real app, you would use a proper markdown library like marked or remark
    // This is a simple implementation for demonstration purposes
    const convertMarkdownToHtml = (markdown: string) => {
      let html = markdown
        // Headers
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Lists
        .replace(/^- (.*$)/gm, "<li>$1</li>")
        // Paragraphs
        .replace(/^\s*$/gm, "</ul><p></p><ul>")

      // Wrap list items in ul tags
      html = html.replace(/<li>.*?<\/li>/g, (match) => {
        if (!match.startsWith("<ul>")) {
          return `<ul>${match}</ul>`
        }
        return match
      })

      // Remove empty ul tags
      html = html.replace(/<ul><\/ul>/g, "")

      // Wrap paragraphs
      html = html.replace(/^([^<].*)/gm, "<p>$1</p>")

      return html
    }

    setHtml(convertMarkdownToHtml(content))
  }, [content])

  if (preview) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return <div className={`markdown ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
