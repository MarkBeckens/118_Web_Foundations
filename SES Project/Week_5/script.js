// Map column types to their cell index
const COLUMN_INDEX = {
    team: 0,
    revenue: 1,
    payroll: 2,
    ses: 3
};

// Select table and sortable headers
const headers = document.querySelectorAll("th[data-type]");
const table = document.querySelector(".team-table tbody");

// Track sort direction for each column (true = ascending)
const sortDirection = {
    team: true,
    revenue: true,
    payroll: true,
    ses: true
};

// Attach click event to each header
headers.forEach(header => {
    header.addEventListener("click", () => handleHeaderClick(header));
});

// Handle column sorting when a header is clicked
function handleHeaderClick(header) {
    const type = header.getAttribute("data-type");
    const isAscending = sortDirection[type];
    const rows = Array.from(table.querySelectorAll("tr"));

    // Sort rows based on column data type
    rows.sort((a, b) => compareRows(a, b, type, isAscending));

    // Toggle direction for next click
    sortDirection[type] = !sortDirection[type];

    // Re-insert rows in sorted order
    rows.forEach(row => table.appendChild(row));

    // Update active arrow indicator
    updateSortArrows(header, sortDirection[type]);
}

// Compare two rows for sorting
function compareRows(rowA, rowB, type, isAscending) {
    const valA = extractValue(rowA, type);
    const valB = extractValue(rowB, type);

    let comparison = 0;
    if (type === "team") {
        comparison = valA.localeCompare(valB);
    } else {
        comparison = valA - valB;
    }

    return isAscending ? comparison : -comparison;
}

// Clear old arrows and show arrow on active column
function updateSortArrows(activeHeader, nextIsAscending) {
    document.querySelectorAll(".sort-arrow").forEach(arrow => {
        arrow.textContent = "";
    });

    const arrow = activeHeader.querySelector(".sort-arrow");
    if (arrow) {
        arrow.textContent = nextIsAscending ? "v" : "^";
    }
}

// Extract values from each row based on column type
function extractValue(row, type) {
    const index = COLUMN_INDEX[type] ?? 0;
    const text = row.children[index].textContent.trim();

    if (type === "team") {
        return text.toLowerCase();
    }

    return parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
}

