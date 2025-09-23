function iterateRecords(data) {

	console.log("Data returned: "+JSON.stringify(data));
	
	var records = data.results;


	Object.values(records).forEach(value => {
		var subject = value["subject"];
		var description = value["description"];
		var location = value["location"];
        var date = value["formatteddatetime"];
        var age = value["age"];

		// Filter out events for young adults, adults, seniors
        if (!age || /young adult|adult|senior/i.test(age)) {
            return; 
        }
		
        // add points and price indicator depending on the cost of the event
        var rawCost = value["cost"];
        var points = 0;
        var priceLabel = "N/A";

        if (rawCost) {
            let price = rawCost.toLowerCase() === "free" ? 0 : parseInt(rawCost.replace(/[^0-9]/g, ''), 10) || 0;

            // Points
            if (price === 0) points = 1;
            else if (price <= 10) points = 2;
            else if (price > 10) points = 3;

            // Price label
            if (price === 0) priceLabel = "$";
            else if (price <= 10) priceLabel = "$$";
            else if (price > 10) priceLabel = "$$$";
        }

        var price = priceLabel;


		// check that we have data for each of the fields we want to display
		if(subject && description && location && date && age && price && points) {
            $("#records").append(
                $('<section class="record">').append(
                    $('<h2>').text(subject),
                    $('<p>').text(description),
                    $('<p>').text(location),
                    $('<p>').text(age),
                    $('<p>').text(date),
                    $('<p>').text(price),
                    $('<p>').text("Points: "+points),
                    $('<button class="view-more">')
						.text("View More")
						.click(function() {
							const params = new URLSearchParams({
							subject: subject,
							start: value["start_datetime"],
							end: value["end_datetime"]
							});

							window.location.href = "/html/event_details.html?" + params.toString();
						})
                    )
                );
		}
	});
}


$(document).ready(function() {
	const apiURLs = [
		"https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/infants-and-toddlers-events/records",
		"https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/library-events/records"
	];

	const requestParams = { limit: 50 };
	const queryString = new URLSearchParams(requestParams).toString();

	apiURLs.forEach(apiURL => {
		const fullURL = apiURL + "?" + queryString;
		console.log("Fetching: " + fullURL);

		fetch(fullURL)
			.then(response => response.json())
			.then(data => iterateRecords(data))
			.catch(error => console.error("Error fetching data from " + apiURL, error));
	});
});

