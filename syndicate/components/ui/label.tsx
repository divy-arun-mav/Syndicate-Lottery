"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <>
      <LabelPrimitive.Root
        data-slot="label"
        className={cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        {...props}
      />
      <style jsx>{`
        [data-slot="label"] {
          font-family: 'Roboto', sans-serif;
          /* Use a dark primary text color for contrast on light backgrounds */
          color: #1A1A2E;
        }
        /* If the label is used on a dark background, you can add a 'dark' class to adjust its color */
        [data-slot="label"].dark {
          color: #F5F5F5;
        }
      `}</style>
    </>
  )
}

export { Label }
