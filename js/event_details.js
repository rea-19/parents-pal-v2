function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

$(document).ready(function() {
    const subject = getQueryParam("subject");
    const start = getQueryParam("start");
    const end = getQueryParam("end");

    if (!subject || !start || !end) {
        $("#event-details").html("<p>Missing event details.</p>");
        return;
    }

    const apiURLs = [
        "https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/infants-and-toddlers-events/records?limit=100",
        "https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/library-events/records?limit=100"
    ];

    Promise.all(apiURLs.map(url => fetch(url).then(res => res.json())))
        .then(datasets => {
            // Merge results from both datasets
            const allResults = datasets.flatMap(data => data.results);

            // Try to find the event that matches subject, start, end
            const record = allResults.find(r =>
                r.subject === subject &&
                r.start_datetime === start &&
                r.end_datetime === end
            );

            if (record) {
                // Default: no booking required
                let bookingButton = `<button>No Booking Required</button>`;

                // If infants-and-toddlers dataset has a booking field
                if (record.booking) {
                    // Extract <a href="..."> link
                    const match = record.booking.match(/href=["']([^"']+)["']/);
                    if (match && match[1]) {
                        bookingButton = `<a href="${match[1]}" target="_blank">
                                            <button>Book Now</button>
                                        </a>`;
                    } else {
                        bookingButton = `<button>Booking Info Unavailable</button>`;
                    }
                }

                $("#event-details").html(`
                    <h1>${record.subject}</h1>
                    <p class="filter"><strong>Date:</strong> ${record.formatteddatetime}</p>
                    <p class="filter"><strong>Location:</strong> ${record.location}</p>
                    <p class="filter"><strong>Age:</strong> ${record.age}</p>
                    <p class="filter"><strong>Event Type:</strong> ${record.primaryeventtype || "N/A"}</p>
                    <p class="filter"><strong>Cost:</strong> ${record.cost || "N/A"}</p>
                    <p>${record.description}</p>
                    <div>${bookingButton}</div>
                `);
            } else {
                $("#event-details").html("<p>Event not found.</p>");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            $("#event-details").html("<p>Error loading event details.</p>");
        });
});