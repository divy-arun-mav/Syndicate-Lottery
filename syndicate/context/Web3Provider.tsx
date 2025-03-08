"use client";

import { Contract, ethers } from "ethers";
import { createContext, useContext, useEffect, type ReactNode, useState } from "react";
import { contractAddress, abi } from "./contract";
import { useAccount } from "wagmi";

interface Web3ContextType {
    connectContract: () => void;
    contract: Contract | null;
    walletAddress: `0x${string}` | undefined;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    const [contract, setContract] = useState<Contract | null>(null);
    const { address: walletAddress, isConnected } = useAccount();

    const connectContract = async () => {
        try {
            if (!window.ethereum) {
                console.error("MetaMask not detected!");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new Contract(contractAddress, abi, signer);
            setContract(contractInstance);
            console.log("Connected to contract:", contractInstance);
        } catch (e) {
            console.error("Error connecting to contract:", e);
        }
    };

    useEffect(() => {
        if (isConnected) {
            connectContract();
        }
    }, [isConnected]);

    console.log(contractAddress);

    return (
        <Web3Context.Provider value={{ connectContract, contract, walletAddress }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = (): Web3ContextType => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error("useWeb3 must be used within a Web3Provider");
    }
    return context;
};