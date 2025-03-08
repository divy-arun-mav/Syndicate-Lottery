"use client";

import { ethers } from "ethers";
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
import { useWeb3 } from "@/context/Web3Provider";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// ✅ Ensure inputs are converted to numbers
const formSchema = z.object({
  entryFee: z.coerce.number().positive("Entry Fee must be a positive number"),
  ticketPrice: z.coerce.number().positive("Ticket Price must be a positive number"),
  duration: z.coerce.number().positive("Duration must be a positive number"),
  minimum_users: z.coerce.number().positive("Minimum users must be a positive number greater than 2 and less than 10"),
  maximum_users: z.coerce.number().positive("Maximum users must be a positive number greater than 2 and less than 10"),
});

export default function CreateLottery({ onCreate }: { onCreate?: (data: any) => void }) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { contract } = useWeb3();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entryFee: 0.01, // ✅ Set number defaults
      ticketPrice: undefined, // ✅ Set number defaults
      duration: undefined,
      minimum_users: 2,
      maximum_users: 9,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (onCreate) onCreate(values);
    if (!contract) {
      toast.error("Contract not connected!");
      console.error("Contract not connected!");
      return;
    }
    try {
      const entryFeeInWei = ethers.utils.parseEther(values.entryFee.toString());
      const ticketPriceInWei = ethers.utils.parseEther(values.ticketPrice.toString());

      const tx = await contract.createLottery(
        ticketPriceInWei,
        values.duration,
        values.minimum_users,
        values.maximum_users,
        { value: entryFeeInWei }
      );
      await tx.wait();
      toast.success("✅ Lottery Created Successfully!");
      setStatusMessage("✅ Lottery Created Successfully!");
      router.push('/joinlot');
    } catch (error) {
      console.error("Transaction failed:", error);
      setStatusMessage("❌ Failed to create lottery");
    }
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
                <FormLabel>Lottery Creation Fee (ETH)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number" 
                    onChange={(e) => field.onChange(Number(e.target.value))} // ✅ Convert to number
                    placeholder="0.01 ETH"
                    value={0.01}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="ticketPrice"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Fee (ETH)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    step=".0001"
                    type="number" 
                    onChange={(e) => field.onChange(Number(e.target.value))} 
                    placeholder="0.001 ETH"
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

          <FormField
            name="minimum_users"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum users</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="maximum_users"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum users</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="9"
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
