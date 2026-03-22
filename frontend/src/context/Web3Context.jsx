import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TruthDAOArtifact from '../contracts/TruthDAO.json';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError("MetaMask not found!");
            return;
        }

        setLoading(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);

            const tempProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await tempProvider.getSigner();

            const tempContract = new ethers.Contract(
                TruthDAOArtifact.address,
                JSON.parse(TruthDAOArtifact.abi),
                signer
            );

            setProvider(tempProvider);
            setContract(tempContract);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to connect wallet");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0] || null);
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    return (
        <Web3Context.Provider value={{ account, contract, provider, loading, error, connectWallet }}>
            {children}
        </Web3Context.Provider>
    );
};
