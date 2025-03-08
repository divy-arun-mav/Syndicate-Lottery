"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Ensure inputs are converted to numbers
const formSchema = z.object({
  entryFee: z.coerce.number().positive("Entry Fee must be a positive number"),
  duration: z.coerce.number().positive("Duration must be a positive number"),
  prizePool: z.coerce.number().positive("Prize Pool must be a positive number"),
});

export default function CreateLottery({ onCreate }: { onCreate?: (data: any) => void }) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entryFee: 0, // ✅ Set number defaults
      duration: 0,
      prizePool: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (onCreate) onCreate(values);
    setStatusMessage("✅ Lottery Created Successfully!");
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold text-blue-500">🎟 Create a Lottery</h2>
      <p className="text-sm text-gray-500">Set up your custom lottery game</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left mt-4">
          {/* Entry Fee */}
          <FormField
            name="entryFee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Fee (ETH)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number" // ✅ Ensure input type is "number"
                    onChange={(e) => field.onChange(Number(e.target.value))} // ✅ Convert to number
                    placeholder="0.01 ETH"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            name="duration"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Seconds)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="3600 (1 Hour)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prize Pool */}
          <FormField
            name="prizePool"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prize Pool (ETH)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="1 ETH"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Create Lottery Button */}
          <Button type="submit" className="mt-6 w-full">
            🎰 Create Lottery
          </Button>
        </form>
      </Form>

      {statusMessage && <p className="mt-4 text-green-500">{statusMessage}</p>}
    </div>
  );
}
