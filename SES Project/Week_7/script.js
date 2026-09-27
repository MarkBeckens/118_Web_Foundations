// Highlights the nav link that matches the current page
function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-box");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

// Map column types to their cell index
const COLUMN_INDEX = {
    team: 0,
    revenue: 1,
    payroll: 2,
    ses: 3
};

// Track sort direction for each column (true = ascending)
const sortDirection = {
    team: true,
    revenue: true,
    payroll: true,
    ses: true
};

// Sets up sorting on the team table; does nothing on pages without one
function initSortableTable() {
    const table = document.querySelector(".team-table tbody");
    if (!table) return;

    const headers = document.querySelectorAll("th[data-type]");
    headers.forEach(header => {
        header.addEventListener("click", () => handleHeaderClick(header, headers, table));
    });
}

// Handle column sorting when a header is clicked
function handleHeaderClick(clickedHeader, allHeaders, table) {
    const type = clickedHeader.getAttribute("data-type");
    const isAscending = sortDirection[type];
    const rows = Array.from(table.querySelectorAll("tr"));

    // Sort rows based on column data type
    rows.sort((rowA, rowB) => compareRows(rowA, rowB, type, isAscending));

    // Toggle direction for next click
    sortDirection[type] = !sortDirection[type];

    // Re-insert rows in sorted order
    rows.forEach(row => table.appendChild(row));

    // Update active arrow indicator to reflect the sort just applied
    updateSortArrows(clickedHeader, allHeaders, isAscending);
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

// Clear old arrows/highlights and show an arrow on the currently sorted column
function updateSortArrows(activeHeader, allHeaders, isAscending) {
    allHeaders.forEach(header => {
        header.classList.remove("sorted");
        const arrow = header.querySelector(".sort-arrow");
        if (arrow) arrow.textContent = "";
    });

    activeHeader.classList.add("sorted");
    const activeArrow = activeHeader.querySelector(".sort-arrow");
    if (activeArrow) {
        activeArrow.textContent = isAscending ? "\u25B2" : "\u25BC";
    }
}

// Extract a comparable value from a row based on column type
function extractValue(row, type) {
    const index = COLUMN_INDEX[type] ?? 0;
    const text = row.children[index].textContent.trim();

    if (type === "team") {
        return text.toLowerCase();
    }

    return parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
}

// Runs once the page has fully loaded; each feature initializes itself independently
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSortableTable();
});
