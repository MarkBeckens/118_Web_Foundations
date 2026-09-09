// Week 4 — Basic JavaScript Program

// Variables
let ticketRevenue = 125000;   // total ticket revenue
let payrollCost   = 98000;    // team payroll cost

// Function: calculate profit
function calculateProfit(revenue, cost) {
    return revenue - cost;
}

// Use the function
let profit = calculateProfit(ticketRevenue, payrollCost);

// Conditional: decide if the team is profitable
if (profit > 0) {
    console.log("The team is profitable.");
    console.log("Profit amount: $" + profit);
} else if (profit === 0) {
    console.log("The team broke even.");
} else {
    console.log("The team is not profitable.");
    console.log("Loss amount: $" + Math.abs(profit));
}
