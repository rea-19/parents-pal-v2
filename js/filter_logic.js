let allFetchedRecords = [];

// Wrap iterateRecords to store fetched records
const originalIterateRecords = window.iterateRecords;
window.iterateRecords = function(data) {
    allFetchedRecords = allFetchedRecords.concat(data.results);
    originalIterateRecords(data);
};

// --- Helper to parse age strings from API into numeric ranges (years) ---
function parseAgeRange(str) {
    str = str.toLowerCase();

    // Convert "6 months" to fraction of year
    const monthMatch = str.match(/(\d+)\s*months?/);
    const yearMatches = str.match(/(\d+)\s*years?/g);
    const dashMatch = str.match(/(\d+)[–\-](\d+)/);

    let min = 0, max = 100;

    // Check for dash style "x-y"
    if(dashMatch) {
        min = parseInt(dashMatch[1], 10);
        max = parseInt(dashMatch[2], 10);
    }
    // Check for "x months to y years" style
    else if(monthMatch && yearMatches && yearMatches.length > 0){
        min = parseInt(monthMatch[1],10)/12;
        max = parseInt(yearMatches[0],10);
    }
    // Check for single "x-y years" style
    else if(yearMatches && yearMatches.length === 2){
        min = parseInt(yearMatches[0],10);
        max = parseInt(yearMatches[1],10);
    }
    // Fallback for single number
    else if(yearMatches && yearMatches.length === 1){
        min = 0;
        max = parseInt(yearMatches[0],10);
    }

    return [min, max];
}

// --- Helper to check if two ranges overlap ---
function rangesOverlap(min1, max1, min2, max2){
    return Math.max(min1, min2) <= Math.min(max1, max2);
}

// --- Filtering function ---
function filterEvents() {
    if(allFetchedRecords.length === 0) return; // nothing to filter yet

    const selectedAges = $("#age").val() || [];
    const selectedCost = $("#cost").val();
    const selectedActivities = $("#activity").val() || [];
    const suburbInput = $("#suburb").val().toLowerCase();
    const dateRange = $("#date-range").val().split(" to ");
let startDate = dateRange[0] ? new Date(dateRange[0]) : null;
let endDate = dateRange[1] ? new Date(dateRange[1]) : null;

// If only one date selected, set endDate to same day 11:59pm
if(startDate && !endDate){
    endDate = new Date(startDate);
    endDate.setHours(23,59,59,999);
}


    
    const filtered = allFetchedRecords.filter(event => {
        // --- AGE ---
        if(selectedAges.length && event.age){
            const [eventMin, eventMax] = parseAgeRange(event.age);
            const matches = selectedAges.some(sel => {
                const parts = sel.split("-");
                const selMin = parseInt(parts[0],10);
                const selMax = parseInt(parts[1],10);
                return rangesOverlap(eventMin, eventMax, selMin, selMax);
            });
            if(!matches) return false;
        }

        // --- COST ---
        if(selectedCost && event.cost) {
            const costValue = parseInt(event.cost.replace(/[^0-9]/g,'')) || 0;
            switch(selectedCost){
                case "free": if(costValue!==0) return false; break;
                case "10-15": if(costValue<10||costValue>15) return false; break;
                case "20-25": if(costValue<20||costValue>25) return false; break;
                case "30-35": if(costValue<30||costValue>35) return false; break;
                case "40+": if(costValue<40) return false; break;
            }
        }

        // --- ACTIVITY ---
        if(selectedActivities.length && event.event_type) {
            if(!selectedActivities.some(act => event.event_type.includes(act))) return false;
        }

        // --- SUBURB ---
        if(suburbInput && event.venueaddress) {
    // Split venueaddress by commas, trim spaces, lowercase
    const parts = event.venueaddress.split(",").map(p => p.trim().toLowerCase());
    const eventSuburb = parts[parts.length - 1]; // last part is usually the suburb
    if(!eventSuburb.includes(suburbInput.toLowerCase())) return false;
}

        // --- DATE ---
        if(startDate && endDate && event.start_datetime) {
            const evDate = new Date(event.start_datetime);
            if(evDate < startDate || evDate > endDate) return false;
        }

        return true;
    });

    $("#records").empty();
    originalIterateRecords({results: filtered});
}

// --- Attach listeners ---
$(document).ready(function(){
    $("#age, #cost, #activity, #suburb").on("change input", filterEvents);
    flatpickr("#date-range", {
        mode:"range",
        dateFormat:"Y-m-d",
        onClose: filterEvents
    });
});
