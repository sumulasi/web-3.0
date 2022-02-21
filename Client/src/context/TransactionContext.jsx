import React, {useEffect, useState} from "react";
import {ethers} from 'ethers';

import { contactAbi, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEtheriumContact = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contactAbi, signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({addressTo: '', amount: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [allTransactions, setAllTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}));
    }

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                if(!ethereum) return alert("Please install MetaMask");

                const transactionContract = getEtheriumContact();
                const availableTransactions = await transactionContract.getAllTransactions();

                const strcturedTransactions = availableTransactions.map((transactions) => ({
                    message: transactions.message,
                    timestamp: new Date(transactions.timestamp.toNumber() * 1000).toLocaleString(),
                    addressFrom: transactions.sender,
                    amount: parseInt(transactions.amount._hex) / (10 ** 18),
                    addressTo: transactions.reciver,
                }))

                setAllTransactions(strcturedTransactions);
            } else {
                console.log("Ethereum is not present");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('No account found');
            }

            getAllTransactions();
        } catch (error) {
            console.error(error);

            throw new Error('No ethereum object');
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEtheriumContact();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem('transactionCount', transactionCount);
        } catch (error) {
            console.error(error);

            throw new Error('No ethereum object');
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);

            throw new Error('No ethereum object');
        }

    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const {addressTo, amount, message} = formData;

            const transactionContract = getEtheriumContact();
            const parssAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', 
                    value: parssAmount._hex
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parssAmount, message);

            setIsLoading(true);
            console.log('Loading - '+transactionHash.hash);
            await transactionHash.wait();
            setIsLoading(false);
            console.log('Sucess - '+transactionHash.hash);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.error(error);

            throw new Error('No ethereum object');
        }

    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading, allTransactions}}>
            {children}
        </TransactionContext.Provider>
    ) 
}