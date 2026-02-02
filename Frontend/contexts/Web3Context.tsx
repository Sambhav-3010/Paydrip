'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner, Contract, formatEther } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
            on: (event: string, callback: (...args: unknown[]) => void) => void
            removeListener: (event: string, callback: (...args: unknown[]) => void) => void
        }
    }
}

interface Web3ContextType {
    account: string | null
    balance: string | null
    chainId: number | null
    isConnecting: boolean
    isConnected: boolean
    provider: BrowserProvider | null
    signer: JsonRpcSigner | null
    contract: Contract | null
    connectWallet: () => Promise<void>
    disconnectWallet: () => void
    error: string | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null)
    const [balance, setBalance] = useState<string | null>(null)
    const [chainId, setChainId] = useState<number | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [provider, setProvider] = useState<BrowserProvider | null>(null)
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
    const [contract, setContract] = useState<Contract | null>(null)
    const [error, setError] = useState<string | null>(null)

    const isConnected = !!account

    useEffect(() => {
        if (signer && CONTRACT_ADDRESS !== "0x2A0328A28d572Eda5b1D91C7c6dFAF9eA4a5de46") {
            const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
            setContract(contractInstance)
        } else {
            setContract(null)
        }
    }, [signer])

    const fetchBalance = useCallback(async (address: string, providerInstance: BrowserProvider) => {
        try {
            const balanceWei = await providerInstance.getBalance(address)
            setBalance(formatEther(balanceWei))
        } catch (err) {
            console.error('Error fetching balance:', err)
        }
    }, [])

    const handleAccountsChanged = useCallback(async (accounts: unknown) => {
        const accountsArray = accounts as string[]
        if (accountsArray.length === 0) {
            setAccount(null)
            setBalance(null)
            setSigner(null)
            setContract(null)
        } else {
            const newAccount = accountsArray[0]
            setAccount(newAccount)
            if (provider) {
                const newSigner = await provider.getSigner()
                setSigner(newSigner)
                fetchBalance(newAccount, provider)
            }
        }
    }, [provider, fetchBalance])

    const handleChainChanged = useCallback((chainIdHex: unknown) => {
        const newChainId = parseInt(chainIdHex as string, 16)
        setChainId(newChainId)
        window.location.reload()
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged)
            window.ethereum.on('chainChanged', handleChainChanged)

            return () => {
                window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
                window.ethereum?.removeListener('chainChanged', handleChainChanged)
            }
        }
    }, [handleAccountsChanged, handleChainChanged])

    const connectWallet = useCallback(async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            setError('MetaMask is not installed. Please install MetaMask to continue.')
            return
        }

        setIsConnecting(true)
        setError(null)

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            }) as string[]

            if (accounts.length === 0) {
                throw new Error('No accounts found')
            }

            const browserProvider = new BrowserProvider(window.ethereum)
            const userSigner = await browserProvider.getSigner()
            const network = await browserProvider.getNetwork()

            setProvider(browserProvider)
            setSigner(userSigner)
            setAccount(accounts[0])
            setChainId(Number(network.chainId))

            await fetchBalance(accounts[0], browserProvider)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
            setError(errorMessage)
            console.error('Error connecting wallet:', err)
        } finally {
            setIsConnecting(false)
        }
    }, [fetchBalance])

    const disconnectWallet = useCallback(() => {
        setAccount(null)
        setBalance(null)
        setChainId(null)
        setProvider(null)
        setSigner(null)
        setContract(null)
        setError(null)
    }, [])

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts'
                    }) as string[]

                    if (accounts.length > 0) {
                        const browserProvider = new BrowserProvider(window.ethereum)
                        const userSigner = await browserProvider.getSigner()
                        const network = await browserProvider.getNetwork()

                        setProvider(browserProvider)
                        setSigner(userSigner)
                        setAccount(accounts[0])
                        setChainId(Number(network.chainId))
                        await fetchBalance(accounts[0], browserProvider)
                    }
                } catch (err) {
                    console.error('Error checking connection:', err)
                }
            }
        }

        checkConnection()
    }, [fetchBalance])

    const value: Web3ContextType = {
        account,
        balance,
        chainId,
        isConnecting,
        isConnected,
        provider,
        signer,
        contract,
        connectWallet,
        disconnectWallet,
        error
    }

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    const context = useContext(Web3Context)
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider')
    }
    return context
}
