import React, { useState } from 'react';
import './add-transaction-popup.css';

const AddTransactionPopup = ({ togglePopup, userId, loadTransactions, fetchBalance }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://banking-website-backend-1.vercel.app/user/${userId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name:name, transaction_type: type, amount:amount }),
      });

      if (response.ok) {
        alert('Transaction added successfully');
        loadTransactions(); 
        fetchBalance();
        // Reload transactions after adding a new one
        togglePopup(); // Close the popup
      } else {
        console.error('Failed to add transaction');
        alert('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add Transaction</h2>
        <form onSubmit={handleAddTransaction}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="deposit"
                  checked={type === 'deposit'}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
                Credit
              </label>
              <label>
                <input
                  type="radio"
                  value="withdraw"
                  checked={type === 'withdraw'}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
                Debit
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Transaction</button>
        </form>
        <button className="close" onClick={togglePopup}>Close</button>
      </div>
    </div>
  );
};

export default AddTransactionPopup;
