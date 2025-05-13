"use client"

import { useState, useRef, useEffect } from "react"
import { Bold, Italic, List, ListOrdered, ImageIcon, LinkIcon, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Markdown } from "@/components/ui/markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder = "Write your content here..." }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (markdownTemplate: string, selectionOffset = 0) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let replacement = markdownTemplate
    if (markdownTemplate.includes("$1")) {
      replacement = markdownTemplate.replace("$1", selectedText)
    }

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
    onChange(newValue)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = selectedText
        ? start + replacement.indexOf(selectedText) + selectedText.length
        : start + selectionOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleBold = () => insertMarkdown("**$1**", 2)
  const handleItalic = () => insertMarkdown("*$1*", 1)
  const handleUnorderedList = () => insertMarkdown("\n- $1", 3)
  const handleOrderedList = () => insertMarkdown("\n1. $1", 4)
  const handleImage = () => insertMarkdown("![alt text](https://example.com/image.jpg)", 2)
  const handleLink = () => insertMarkdown("[link text](https://example.com)", 1)
  const handleCode = () => insertMarkdown("```\n$1\n```", 4)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex items-center gap-1 flex-wrap">
        <Button type="button" variant="ghost" size="sm" onClick={handleBold} className="h-8 w-8 p-0" title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleItalic} className="h-8 w-8 p-0" title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnorderedList}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleOrderedList}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleImage} className="h-8 w-8 p-0" title="Image">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleLink} className="h-8 w-8 p-0" title="Link">
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleCode} className="h-8 w-8 p-0" title="Code Block">
          <Code className="h-4 w-4" />
        </Button>

        <div className="ml-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="relative">
        <TabsContent value="write" className="mt-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[300px] p-4 resize-none focus:outline-none"
            style={{ height: "auto" }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="p-4 min-h-[300px] prose max-w-none">
            {value ? <Markdown content={value} /> : <p className="text-muted-foreground">{placeholder}</p>}
          </div>
        </TabsContent>
      </div>
    </div>
  )
}
