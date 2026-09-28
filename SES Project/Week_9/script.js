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

// ---------------------------------------------------------------------------
// REVENUE REPORT (asynchronous behavior)
//
// About page: the user picks a year and an SES share %, then clicking
// "Create Report" plays a timed, multi-step sequence (setTimeout chained
// step-by-step) before sending the user to the Team page to view it.
// Team page: if it detects a report was just requested, it shows its own
// loading sequence before revealing the table with numbers recalculated
// for the chosen year/%. "Regenerate Report" sends the user back to About
// so they can change those inputs and generate a new report.
// ---------------------------------------------------------------------------

const REPORT_PARAMS_KEY = "sesReportParams"; // persisted: { year, percent, generatedAt }
const REPORT_PENDING_KEY = "sesReportPending"; // one-shot flag: play the Team page loading sequence

const DEFAULT_REPORT_YEAR = 2025;

const REPORT_STEPS = [
    "Collecting team revenue data...",
    "Calculating payroll shares...",
    "Compiling report..."
];

const TEAM_LOAD_STEPS = [
    "Opening payroll ledger...",
    "Cross-checking SES shares...",
    "Rendering report..."
];

const STEP_DELAY_MS = 800;

// Roughly projects/backdates revenue relative to the 2025 baseline dataset
function yearFactor(year) {
    return Math.pow(1.04, year - DEFAULT_REPORT_YEAR);
}

function formatMillions(value) {
    const rounded = Math.round(value * 10) / 10;
    return `$${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
}

function getStoredReportParams() {
    const raw = sessionStorage.getItem(REPORT_PARAMS_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Saves the selected report settings for the Team page to use
function saveReportParams(year, percent) {
    sessionStorage.setItem(REPORT_PARAMS_KEY, JSON.stringify({ year, percent, generatedAt: Date.now() }));
    sessionStorage.setItem(REPORT_PENDING_KEY, "1");
}

// Runs each step's text update on a delay, then calls onDone once finished
function runStepSequence(steps, delayMs, onStep, onDone, stepIndex = 0) {
    if (stepIndex >= steps.length) {
        onDone();
        return;
    }

    onStep(steps[stepIndex]);
    setTimeout(() => runStepSequence(steps, delayMs, onStep, onDone, stepIndex + 1), delayMs);
}

// Finishes report generation and sends the user to the Team page
function finishReportGeneration(status, year, percent) {
    status.textContent = "Report ready. Opening Team page...";
    saveReportParams(year, percent);
    setTimeout(() => { window.location.href = "team.html"; }, STEP_DELAY_MS);
}

// Handles the report button after the user chooses a year and SES share %
function handleCreateReport(btn, status, yearSelect, percentSelect) {
    const year = Number(yearSelect.value);
    const percent = Number(percentSelect.value);

    btn.disabled = true;
    btn.textContent = "Generating...";

    runStepSequence(
        REPORT_STEPS,
        STEP_DELAY_MS,
        (text) => { status.textContent = text; },
        () => finishReportGeneration(status, year, percent)
    );
}

// About page: wires up the year/% inputs and the "Create Report" button
function initReportGenerator() {
    const btn = document.getElementById("createReportBtn");
    if (!btn) return;

    const status = document.getElementById("reportStatus");
    const yearSelect = document.getElementById("reportYear");
    const percentSelect = document.getElementById("reportPercent");

    // Prefill with the last-generated report's settings, if any
    const stored = getStoredReportParams();
    if (stored) {
        yearSelect.value = stored.year;
        percentSelect.value = stored.percent;
    }

    btn.addEventListener("click", () => handleCreateReport(btn, status, yearSelect, percentSelect));
}

// Updates a table header's label without disturbing its sort arrow span
function setHeaderLabel(type, label) {
    const box = document.querySelector(`th[data-type="${type}"] .th-box`);
    if (!box) return;
    const textNode = Array.from(box.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.nodeValue = `${label} `;
}

// Recalculates every row (and the column headers) for the chosen year/%
function applyReportParams(table, year, percent) {
    const factor = yearFactor(year);

    table.querySelectorAll("tbody tr").forEach(row => {
        const baseRevenue = Number(row.dataset.revenue);
        const basePayroll = Number(row.dataset.payroll);
        const revenue = baseRevenue * factor;
        const payroll = basePayroll * factor;
        const sesPayroll = revenue * (percent / 100);

        row.children[COLUMN_INDEX.revenue].textContent = formatMillions(revenue);
        row.children[COLUMN_INDEX.payroll].textContent = formatMillions(payroll);
        row.children[COLUMN_INDEX.ses].textContent = formatMillions(sesPayroll);
    });

    setHeaderLabel("revenue", `${year} Revenue`);
    setHeaderLabel("payroll", `${year} Payroll`);
    setHeaderLabel("ses", `SES Payroll (${percent}%)`);
}

// Shows the completed report table and its generated time
function showLoadedReport(table, loading, result, params) {
    if (params) applyReportParams(table, params.year, params.percent);

    loading.hidden = true;
    table.hidden = false;

    if (params) {
        result.hidden = false;
        result.textContent = `Report generated at ${new Date(params.generatedAt).toLocaleTimeString()} — ${params.year} data, SES share ${params.percent}%`;
    }
}

// Sends the user back to About so they can change the year/% and generate a new report
function handleRegenerateReport() {
    window.location.href = "about.html";
}

// Team page: reveals the table only after a loading sequence finishes
function initReportReveal() {
    const table = document.getElementById("teamTable");
    const loading = document.getElementById("reportLoading");
    const loadingText = document.getElementById("reportLoadingText");
    const result = document.getElementById("reportResult");
    const regenerateBtn = document.getElementById("regenerateBtn");
    if (!table || !loading || !result) return;

    const params = getStoredReportParams();
    const isPending = sessionStorage.getItem(REPORT_PENDING_KEY) === "1";

    if (isPending && params) {
        // Coming from the About page's "Create Report" button
        sessionStorage.removeItem(REPORT_PENDING_KEY);
        table.hidden = true;
        result.hidden = true;
        loading.hidden = false;

        runStepSequence(
            TEAM_LOAD_STEPS,
            STEP_DELAY_MS,
            (text) => { loadingText.textContent = text; },
            () => showLoadedReport(table, loading, result, params)
        );
    } else if (params) {
        // Revisiting/reloading after a report already exists this session
        showLoadedReport(table, loading, result, params);
    }

    // Sends the user back to About so they can change the year/% and generate a new report
    if (regenerateBtn) {
        regenerateBtn.addEventListener("click", handleRegenerateReport);
    }
}

// Runs once the page has fully loaded; each feature initializes itself independently
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSortableTable();
    initReportGenerator();
    initReportReveal();
});

