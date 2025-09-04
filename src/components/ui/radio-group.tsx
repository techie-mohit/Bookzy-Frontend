"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CheckCheckIcon, CheckIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-5 shrink-0 rounded-full border border-gray-400 shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-green-500/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-green-500",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center size-full rounded-full bg-green-500"
      >
        <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3]" /> {/* ✅ white tick */}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}



export { RadioGroup, RadioGroupItem }
