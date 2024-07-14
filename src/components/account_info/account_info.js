import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './account_info.css';
import AddTransactionPopup from './add-transaction-popup';

function Account() {
    const { userId } = useParams();
    const [email, setEmail] = useState(null);
    const [initialBalance, setInitialBalance] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(null);
    const [activeTab, setActiveTab] = useState('transactions');
    const [transactions, setTransactions] = useState([]);
    const [statements] = useState([
        { id: 1, name: 'Sample Statement 1', file: `${process.env.PUBLIC_URL}/sample-1.pdf` },
        { id: 2, name: 'Sample Statement 2', file: `${process.env.PUBLIC_URL}/sample-2.pdf` },
    ]);
    const [showAddTransactionPopup, setShowAddTransactionPopup] = useState(false);

    useEffect(() => {
        if (activeTab === 'transactions') {
            loadTransactions();
        }
    }, [activeTab]);

    useEffect(() => {
        fetchBalance(); // Fetch balance on initial load
    }, [userId]); // Depend on userId changes

    const fetchBalance = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/${userId}/balance`);
            if (response.ok) {
                const { initial_balance, balance, email } = await response.json();
                setInitialBalance(initial_balance);
                setCurrentBalance(balance);
                setEmail(email);
            } else {
                console.error('Failed to fetch user balance');
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
        }
    };


    const loadTransactions = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/${userId}/transaction`);
            if (response.ok) {
                const transactionData = await response.json();
                setTransactions(transactionData);
            } else {
                console.error('Failed to fetch transaction data');
            }
        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    };

    const downloadStatement = (statement) => {
        const doc = new jsPDF();
        doc.text(`Downloaded ${statement.name}`, 20, 20);
        doc.save(`${statement.name}.pdf`);
    };



    const emailStatement = async (statement) => {
        try {
            const response = await fetch(statement.file);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('to', email);
            formData.append('subject', 'Statement PDF');
            formData.append('text', 'Attached is your statement PDF.');
            formData.append('pdfFile', blob, `${statement.name}.pdf`);

            const emailResponse = await fetch('http://localhost:5000/send-statement', {
                method: 'POST',
                body: formData
            });

            if (emailResponse.ok) {
                alert('Statement emailed successfully!');
            } else {
                console.error('Failed to email statement');
            }
        } catch (error) {
            console.error('Error emailing statement:', error);
        }
    };
    const openTab = (tabName) => {
        setActiveTab(tabName);
    };
    const toggleAddTransactionPopup = () => {
        setShowAddTransactionPopup(!showAddTransactionPopup);
    };

    return (
        <div className="account-container">
            <Link to="/" className="back-link">Back to home screen</Link>
            <div className="header">
                <div className="account-name">Welcome User</div>
                <div className="dropdown">
                    <button className="dropbtn">More</button>
                    <div className="dropdown-content">
                        <a href="#">Account Settings</a>
                        <Link to={`/profile-details/${userId}`}>Personal Details</Link>
                        <Link to={`/privacy/${userId}`}>Privacy & Security</Link>
                        <Link to="/">Log out</Link>
                    </div>
                </div>
            </div>

            <div className="account-details">
                <div className="account-summary">
                    <div className="summary-item">
                        <p>Sort code</p>
                        <p>60-84-56</p>
                    </div>
                    <div className="summary-item">
                        <p>Account number</p>
                        <p>82918037</p>
                    </div>
                    <div className="summary-item">
                        <p>Initial balance</p>
                        <p>£{initialBalance}</p>
                    </div>
                    <div className="summary-item">
                        <p>Updated balance</p>
                        <p>£{currentBalance}</p>
                    </div>
                    <div className="summary-item">
                        <p>Gross Interest</p>
                        <p>5.04%</p>
                    </div>
                    <div className="summary-item">
                        <p>AER Interest</p>
                        <p>5.16%</p>
                    </div>
                </div>
            </div>

            <div className="nav-tabs">
                <button className={`tab-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => openTab('transactions')}>Transactions</button>
                <button className={`tab-link ${activeTab === 'statements' ? 'active' : ''}`} onClick={() => openTab('statements')}>Statements</button>
            </div>

            {activeTab === 'transactions' && (
                <div id="transactions" className="transactions">
                    <h2>Transactions</h2>
                    <button onClick={toggleAddTransactionPopup} className="add-transaction-button">Add Transaction</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.name}</td>
                                    <td>{transaction.transaction_type}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.updated_balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'statements' && (
                <div id="statements" className="statements">
                    <h2>Statements</h2>
                    <div id="statement-content">
                        {statements.map((statement) => (
                            <div key={statement.id} className="statement">
                                <div className="statement-header">
                                    <a href={statement.file} target="_blank" rel="noopener noreferrer">{statement.name}</a>
                                    <div className="statement-actions">
                                        <span onClick={() => downloadStatement(statement)}>
                                            <FontAwesomeIcon icon={faDownload} className="action-icon" />
                                        </span> <br></br>
                                        <span onClick={() => emailStatement(statement)}>
                                            <FontAwesomeIcon icon={faEnvelope} className="action-icon" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showAddTransactionPopup && (
                <AddTransactionPopup
                    togglePopup={toggleAddTransactionPopup}
                    userId={userId}
                    loadTransactions={loadTransactions}
                    fetchBalance={fetchBalance}
                    
                />
            )}
        </div>
    );
}

export default Account;
