/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { wagmiAdapter, projectId } from "@/config";
import { createAppKit } from "@reown/appkit";
import { mainnet, arbitrum, sepolia } from "@reown/appkit/networks";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
    throw new Error("Project Id not defined");
}

const metadata = {
    name: "sydicate_lottery",
    description: "Syndicate Lottery",
    url: "http://localhost:3000",
    icons: ["https://avatars.githubusercontent.com/u/179229932"]
};

const networks = [mainnet, arbitrum, sepolia];

const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet, arbitrum, sepolia],
    defaultNetwork: sepolia,
    features: {
        analytics: true,
        email: true,
        socials: ["google", "x", "github", "discord"],
        emailShowWallets: true
    },
    themeMode: "light",
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export default ContextProvider;