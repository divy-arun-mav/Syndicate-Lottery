"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <>
      <FormItemContext.Provider value={{ id }}>
        <div
          data-slot="form-item"
          className={cn("grid gap-2", className)}
          {...props}
        />
      </FormItemContext.Provider>
      <style jsx>{`
        [data-slot="form-item"] {
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <>
      <Label
        data-slot="form-label"
        data-error={!!error}
        className={cn("data-[error=true]:text-destructive-foreground", className)}
        htmlFor={formItemId}
        {...props}
      />
      <style jsx>{`
        [data-slot="form-label"] {
          font-family: "Montserrat", sans-serif;
          color: #1a1a2e; /* Dark primary text */
        }
        [data-slot="form-label"][data-error="true"] {
          color: #c70039; /* Deep red for errors */
        }
      `}</style>
    </>
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <>
      <Slot
        data-slot="form-control"
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      />
      <style jsx>{`
        [data-slot="form-control"] {
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </>
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <>
      <p
        data-slot="form-description"
        id={formDescriptionId}
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
      <style jsx>{`
        [data-slot="form-description"] {
          font-family: "Roboto", sans-serif;
          color: #555; /* Neutral tone for description */
        }
      `}</style>
    </>
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <>
      <p
        data-slot="form-message"
        id={formMessageId}
        className={cn("text-destructive-foreground text-sm", className)}
        {...props}
      >
        {body}
      </p>
      <style jsx>{`
        [data-slot="form-message"] {
          font-family: "Roboto", sans-serif;
          color: #c70039; /* Deep red for error messages */
        }
      `}</style>
    </>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
