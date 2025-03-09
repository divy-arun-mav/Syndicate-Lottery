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
      ticketPrice: undefined,
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
    <div className="lottery-page">
      <div className="lottery-container">
        <h2 className="heading">🎟 Create a Lottery</h2>
        <p className="subheading">Set up your custom lottery game</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form space-y-4 text-left mt-4">
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
            <Button type="submit" className="submit-button">
              🎰 Create Lottery
            </Button>
          </form>
        </Form>

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>

      <style jsx>{`
        /* Overall Page Styling */
        .lottery-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1A1A2E; /* Dark primary background */
          padding: 1rem;
          font-family: 'Roboto', sans-serif;
        }

        /* Container Styling */
        .lottery-container {
          background: #F5F5F5; /* Light off-white background */
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          text-align: center;
          width: 100%;
          max-width: 400px;
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Heading Styling */
        .heading {
          font-size: 2.5rem;
          font-weight: bold;
          color: #FFD700; /* Gold accent for headings */
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
          animation: slideIn 1s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Subheading Styling */
        .subheading {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1rem;
        }

        /* Form and Input Styling */
        .form :global(input) {
          border: 1px solid #ccc;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: border-color 0.3s ease;
          width: 100%;
        }

        .form :global(input:focus) {
          border-color: #FFD700; /* Gold on focus */
          outline: none;
        }

        /* Submit Button Styling with Gradient */
        .submit-button {
          background: linear-gradient(45deg, #FFD700, #C70039); /* Gold to deep red gradient */
          color: #1A1A2E;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: bold;
          transition: background 0.3s ease, transform 0.2s ease;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
        }

        .submit-button:hover {
          background: linear-gradient(45deg, #FFC107, #D32F2F);
          transform: scale(1.02);
        }

        /* Status Message Styling */
        .status-message {
          margin-top: 1rem;
          font-weight: bold;
          color: #28a745;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        /* Additional Link Styling (if any links are added later) */
        a {
          color: #00BFFF; /* Electric blue accent */
          text-decoration: none;
          transition: color 0.3s ease;
        }

        a:hover {
          color: #FFD700;
        }
      `}</style>
    </div>
  );
}
