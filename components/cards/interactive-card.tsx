"use client"

import type React from "react"

import { useState } from "react"
import { BaseCard } from "./base-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { InteractiveCardProps, FormField } from "@/lib/types/card-templates"
import { cn } from "@/lib/utils"

export function InteractiveCard({
  formType = "input",
  fields = [],
  onSubmit,
  colorScheme,
  ...props
}: InteractiveCardProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const colors = {
    primaryButton: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-[var(--ds-text-inverse)]",
    contentText: "text-[var(--text-secondary)]",
    errorText: "text-[var(--status-error)]",
    borderColor: "border-[var(--border-color)]",
    ...colorScheme,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const updateField = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn("text-sm font-medium", colors.contentText)}>
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full"
            />
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn("text-sm font-medium", colors.contentText)}>
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-1">*</span>}
            </Label>
            <select
              id={field.id}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]"
            >
              <option value="">{field.placeholder || "Select an option"}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn("text-sm font-medium", colors.contentText)}>
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-1">*</span>}
            </Label>
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] min-h-[80px]"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <BaseCard colorScheme={colors} {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(renderField)}

        {onSubmit && (
          <Button type="submit" className="w-full font-medium">
            Submit
          </Button>
        )}
      </form>
    </BaseCard>
  )
}
