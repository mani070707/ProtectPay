// Initialize guardian and ward information
document.addEventListener('DOMContentLoaded', () => {
    // Sample user data (in a real app, this would come from a database/API)
    const guardianInfo = {
        name: "John Doe",
        email: "john.doe@example.com",
        wardUsername: "WardUser123"
    };

    // Update profile section
    document.getElementById('guardian-name').textContent = guardianInfo.name;
    document.getElementById('guardian-email').textContent = guardianInfo.email;
    document.getElementById('ward-username').textContent = guardianInfo.wardUsername;
});

// Initialize transaction history and balances
let transactions = [];
let totalReceived = 0;
let pendingRequests = [];

// Function to handle money requests
function handleRequest(type) {
    const amount = type === 'Daily Balance' ? 500 : 5000;
    const request = {
        id: Date.now(),
        type: type,
        amount: amount,
        status: 'pending',
        timestamp: new Date().toLocaleString()
    };
    
    pendingRequests.push(request);
    updateCashinList();
    
    // Simulate automatic approval after 5 seconds (for demonstration)
    setTimeout(() => approveRequest(request.id), 5000);
}

// Function to approve requests
function approveRequest(requestId) {
    const requestIndex = pendingRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        const request = pendingRequests[requestIndex];
        request.status = 'approved';
        
        // Update total received amount
        totalReceived += request.amount;
        
        // Add to transactions history
        transactions.push({
            ...request,
            approvalDate: new Date().toLocaleString()
        });
        
        // Remove from pending requests
        pendingRequests.splice(requestIndex, 1);
        
        // Update UI
        updateCashinList();
        updateReceivedAmount();
    }
}

// Function to update the cashin list display
function updateCashinList() {
    const cashinList = document.getElementById('cashin-list');
    cashinList.innerHTML = ''; // Clear current list
    
    // Add pending requests
    pendingRequests.forEach(request => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${request.type}: ₹${request.amount}
            <span class="status pending">Pending</span>
            <span class="timestamp">${request.timestamp}</span>
        `;
        cashinList.appendChild(listItem);
    });
    
    // Add approved transactions (last 5)
    transactions.slice(-5).forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${transaction.type}: ₹${transaction.amount}
            <span class="status approved">Approved</span>
            <span class="timestamp">${transaction.approvalDate}</span>
        `;
        cashinList.appendChild(listItem);
    });
}

// Function to update the received amount display
function updateReceivedAmount() {
    const cashinCard = document.querySelector('.card:last-child p');
    cashinCard.textContent = `Amount Received: ₹${totalReceived}`;
}

// Add some CSS classes dynamically
const style = document.createElement('style');
style.textContent = `
    .status {
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
        font-size: 0.8em;
    }
    
    .pending {
        background-color: #ffd700;
        color: #000;
    }
    
    .approved {
        background-color: #4caf50;
        color: #fff;
    }
    
    .timestamp {
        font-size: 0.8em;
        color: #666;
        margin-left: 8px;
    }
    
    #cashin-list {
        list-style: none;
        padding: 0;
    }
    
    #cashin-list li {
        margin-bottom: 8px;
        padding: 8px;
        border-bottom: 1px solid #eee;
    }
`;
document.head.appendChild(style);