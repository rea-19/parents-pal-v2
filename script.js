function getYear(year) {
	if(year) {
		return year.match(/[\d]{4}/); // This is regex: https://en.wikipedia.org/wiki/Regular_expression
	}
}

function iterateRecords(data) {
	console.log("Data returned: "+JSON.stringify(data));
	const records = data.result.records;
	//Setup up leaflet map here
	const myMap = L.map("map-container").setView([-27, 153], 8);
		L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiczQ5NDAxMDIiLCJhIjoiY21mc3BydXJ6MG96bDJucHV2MHh0Z3A4NyJ9.2uhSXacaAjcNWubqKfAI8Q", {
  			attribution: 
			'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + 
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  			maxZoom: 18,
  			tileSize: 512,
  			zoomOffset: -1
		}).addTo(myMap);


	// Iterate over each record and add a marker using the Latitude field (also containing longitude)
	Object.entries(records).forEach(([key, value]) => {
		var lat = value["Lat"];
    	var long = value["Lon"];
		var recordTitle = value["Title"];
    	var recordLink = value["Link"];
    	var recordDescription = value["Description"];
		if(lat && long){
			console.log("Location: "+lat+","+long);
			var marker = L.marker([lat,long]).addTo(myMap);
			var recordTitle = value["Title"] || "No Title";
			var recordLink = value["Link"] || "#";
			var recordDescription = value["Description"] || "No description available";

			popupText = "<strong>"+recordTitle+"</strong><br /><a href='"+recordLink+"'>"+recordLink+"</a><br />"+recordDescription;
			var popUp = L.popup({
    			content: popupText, 
    			className: "mapUp"
			});

		marker.bindPopup(popUp).openPopup();
		}
	});
	// Setup the map as per the Leaflet instructions:
	// <https://leafletjs.com/examples/quick-start/>

	}


document.addEventListener("DOMContentLoaded", () => {
    
  const apiURL = "https://www.data.qld.gov.au/api/3/action/datastore_search";
  const params = {
    resource_id: "9eaeeceb-e8e3-49a1-928a-4df76b059c2d",
    limit: 100,
    q: "queensland"
  };
  fetch(`${apiURL}?${new URLSearchParams(params)}`)
    .then(res => res.json())
    .then(iterateRecords)
    .catch(err => console.error("Fetch error:", err));
});

function iterateRecords(data) {
  const records = data.result.records;

  const map = L.map("map-container", {
    center: [-27.4698, 153.0251],
    zoom: 12,
    fullscreenControl: true
  });

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}" +
    "?access_token=pk.eyJ1IjoiczQ5NDAxMDIiLCJhIjoiY21mNHkyb2RjMGFlOTJqcHAwZm5wMDM0ciJ9.55euBfpa2zVcoFTfE6E0ZQ",
    {
      attribution:
        '© OpenStreetMap contributors | © Mapbox',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1
    }
  ).addTo(map);

  map.invalidateSize();

  records.forEach(value => {
    const lat = parseFloat(value.Lat);
    const lng = parseFloat(value.Lon);
    if (!lat || !lng) return;

    const popupContent = `
      <strong>${value.Title || "No Title"}</strong><br>
      <a href="${value.Link || "#"}" target="_blank">${value.Link || "No link"}</a><br>
      ${value.Description || "No description"}
    `;

	L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
  });
}