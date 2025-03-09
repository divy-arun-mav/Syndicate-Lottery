"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ethers } from "ethers";
import { useWeb3 } from "@/context/Web3Provider";

interface Lottery {
    id: number;
    winner: string;
    prize: string;
    ended: boolean;
}

const CompletedLotteries = () => {
    const { contract } = useWeb3(); // Get contract instance
    const [completedLotteries, setCompletedLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedLotteries = async () => {
            if (!contract) return;
            setLoading(true);

            try {
                const totalLotteries: number = await contract.lotteryCount();
                const lotteries: Lottery[] = [];

                for (let i = 1; i <= totalLotteries; i++) {
                    const lottery = await contract.lotteries(i);
                    console.log(lottery);
                    if (lottery.ended) {
                        lotteries.push({
                            id: i,
                            winner: lottery.winner,
                            prize: ethers.utils.formatEther(lottery.prizePool), // Convert Wei to ETH
                            ended: lottery.ended,
                        });
                    }
                }

                setCompletedLotteries(lotteries);
            } catch (error) {
                console.error("Error fetching completed lotteries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedLotteries();
    }, [contract]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Completed Lotteries</h2>

            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : completedLotteries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {completedLotteries.map((lottery) => (
                        <Card key={lottery.id} className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Lottery #{lottery.id}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Winner:</strong> {lottery.winner}</p>
                                <p><strong>Prize:</strong> {lottery.prize} ETH</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No completed lotteries found.</p>
            )}
        </div>
    );
};

export default CompletedLotteries;