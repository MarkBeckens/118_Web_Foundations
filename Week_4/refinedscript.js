// Week 4 — Refined JavaScript Program

// Variables
let ticketRevenue = 125000;
let payrollCost = 98800;
let concessionsRevenue = 45000;   // new variable for additional income


// Function: calculate total revenue
function calculateTotalRevenue(ticketRev, concessionsRev) {
    return ticketRev + concessionsRev;
}


// Function: calculate profit
function calculateProfit(totalRevenue, cost) {
    return totalRevenue - cost;
}


// Use the functions
let totalRevenue = calculateTotalRevenue(ticketRevenue, concessionsRevenue);
let profit = calculateProfit(totalRevenue, payrollCost);


// Expanded conditional logic
if (profit > 50000) {
    console.log("Excellent performance! The team is highly profitable.");
    console.log("Profit amount: $" + profit);
} else if (profit > 0 && profit <= 50000) {
    console.log("The team is profitable.");
    console.log("Profit amount: $" + profit);
} else if (profit === 0) {
    console.log("The team broke even.");
} else {
    console.log("The team is not profitable.");
    console.log("Loss amount: $" + Math.abs(profit));
}
