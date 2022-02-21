import React, { useContext, useState } from "react";
import { SiEthereum } from "react-icons/si";
import { Loader } from ".";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

import dummyData from "../utils/dummyData";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, amount }) => {
  return (
    <div className="bg-gradient-to-r from-[#0C090A] to-[#3A3B3C] m-4 flex flex-1
      2xl:min-w-[370px]
      2xl:max-w-[370px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-xl hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center mb-4">
            <SiEthereum fontSize={21} color="#fff" />
          </div>
          <a href={`https://ropsten.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <a href={`https://ropsten.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
        </div>
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const {allTransactions, currentAccount} = useContext(TransactionContext);
  const [isViewAll, setIsViewAll] = useState(false);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}

        {
          allTransactions.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center mt-10">
              {
                !isViewAll ? <div className="flex flex-wrap">
                  {[...allTransactions].reverse().slice(0, 12).map((transaction, i) => (
                    <TransactionsCard key={i} {...transaction} />
                  ))}
                </div> : <div className="flex flex-wrap">
                  {[...allTransactions].reverse().map((transaction, i) => (
                    <TransactionsCard key={i} {...transaction} />
                  ))}
                </div>
              }
              {
                (!isViewAll && allTransactions.length > 9) &&
                <button type="button" className="rounded-full bg-[#2952e3] cursor-pointer hover:bg-[#2546bd] my-5 p-3 px-5 text-white" onClick={() => setIsViewAll(true)}>
                  View All
                </button>
              }
              
          </div>
          ) : <Loader />
        }
        
      </div>
    </div>
  );
};

export default Transactions;