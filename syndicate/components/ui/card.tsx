import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="card"
        className={cn(
          "bg-blue-50 text-blue-900 flex flex-col gap-6 rounded-xl border border-blue-300 py-6 shadow-lg",
          className
        )}
        {...props}
      />
      <style jsx>{`
        [data-slot="card"] {
          background: #F5F5F5; /* Off-white background */
          color: #1A1A2E; /* Dark primary text */
          border-color: #ccc;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="card-header"
        className={cn(
          "flex flex-col gap-1.5 px-6 border-b border-blue-200 pb-3",
          className
        )}
        {...props}
      />
      <style jsx>{`
        [data-slot="card-header"] {
          border-color: #ccc;
        }
      `}</style>
    </>
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="card-title"
        className={cn("leading-none font-semibold text-2xl", className)}
        {...props}
      />
      <style jsx>{`
        [data-slot="card-title"] {
          font-family: "Montserrat", sans-serif;
          color: #1A1A2E;
        }
      `}</style>
    </>
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="card-description"
        className={cn("text-blue-700 text-sm", className)}
        {...props}
      />
      <style jsx>{`
        [data-slot="card-description"] {
          font-family: "Roboto", sans-serif;
          color: #555; /* Neutral tone for description */
        }
      `}</style>
    </>
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="card-content"
        className={cn("px-6 text-blue-800", className)}
        {...props}
      />
      <style jsx>{`
        [data-slot="card-content"] {
          font-family: "Roboto", sans-serif;
          color: #333;
        }
      `}</style>
    </>
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="card-footer"
        className={cn(
          "flex items-center px-6 border-t border-blue-200 pt-3",
          className
        )}
        {...props}
      />
      <style jsx>{`
        [data-slot="card-footer"] {
          font-family: "Roboto", sans-serif;
          border-color: #ccc;
        }
      `}</style>
    </>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
