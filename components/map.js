if (typeof L === "undefined") {
  console.error("Leaflet (L) is not loaded.");
} else {
  var map = L.map("map").setView([40.8487, -73.9312], 17);

  // Base map layer
  var baseMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  baseMap.addTo(map);

  // Thermal map overlay from OpenWeatherMap
  var thermalOverlay = L.tileLayer(
    "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=75e7d2c526fc36b3fba92f03d3564b1f",
    { opacity: 1 } // Set opacity and ensure it overlays on top
  );

  // Add layer control for toggling thermal overlay
  var overlays = {
    "Thermal Overlay": thermalOverlay,
  };

  L.control.layers(null, overlays).addTo(map);

  // Add legend for thermal map
  var thermalLegend = L.control({ position: "bottomright" });

  thermalLegend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Thermal Map</h4>";

    // Add the thermal map legend as an image
    div.innerHTML += `<img src="https://cdn.glitch.global/e213384d-62bf-4b30-8f1f-d122d6237505/Screenshot%202024-10-31%20at%2011.08.07%E2%80%AFPM.png?v=1730430502574" 
                    alt="Thermal Map Legend" style="width: auto; max-width: 200px; height: auto;" />`;

    return div;
  };

  thermalLegend.addTo(map);

  // Define the coordinates for the polygon
  var polygonCoordinates = [
    [40.85045, -73.9348],
    [40.85059, -73.9347],
    [40.84878, -73.93036],
    [40.8486, -73.93048],
  ];

  // Create the polygon
  var diagonalPolygon = L.polygon(polygonCoordinates, {
    color: "purple",
    weight: 2,
    fill: true,
  }).addTo(map);

  // Tooltip for the polygon
  var tooltip = L.tooltip({ permanent: false, direction: "top" });
  diagonalPolygon.on("mouseover", function (e) {
    tooltip
      .setContent("Clean Air Green Corridor")
      .setLatLng(e.latlng)
      .addTo(map);
  });
  diagonalPolygon.on("mouseout", function () {
    map.removeLayer(tooltip);
  });

  var polygonBounds = L.latLngBounds(polygonCoordinates);

  // Load existing markers from localStorage
  function loadMarkers() {
    const markers = JSON.parse(localStorage.getItem("mapMarkers")) || [];
    markers.forEach((marker) => {
      addMarker(
        marker.lat,
        marker.lng,
        marker.type,
        marker.date,
        marker.description,
        marker.image,
        false // Prevent saving again on load
      );
    });
  }

  // Save markers to localStorage
  function saveMarkers(markers) {
    localStorage.setItem("mapMarkers", JSON.stringify(markers));
  }

  // Add a marker on map click
  map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    if (polygonBounds.contains([lat, lng])) {
      const litterType = prompt(
        "Select the type of litter:\n1. Trash\n2. Dangerous Item\n3. Clean Area"
      );

      if (litterType === null) return;

      let markerType;
      switch (litterType.toLowerCase()) {
        case "trash":
          markerType = "trash";
          break;
        case "dangerous item":
          markerType = "Dangerous Item";
          break;
        case "clean area":
          markerType = "clean";
          break;
        default:
          alert("Invalid input. Please choose a valid type.");
          return;
      }

      const date = prompt(
        "Enter the date you found the litter (e.g., 2024-11-19):"
      );
      if (date === null) return;

      const description = prompt("Enter a description of the litter found:");
      if (description === null) return;

      const addImage = confirm("Would you like to add an image of the litter?");
      let image = null;

      if (addImage) {
        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.addEventListener("change", function () {
          const file = imageInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              image = e.target.result;
              addMarker(lat, lng, markerType, date, description, image);
            };
            reader.readAsDataURL(file);
          }
        });
        imageInput.click();
      } else {
        addMarker(lat, lng, markerType, date, description, image);
      }
    } else {
      alert("Markers can only be added inside the Focus area of the CAGC.");
    }
  });

  // Function to add a marker
  function addMarker(lat, lng, type, date, description, image, save = true) {
    const icon = getMarkerIcon(type);

    const marker = L.marker([lat, lng], { icon }).addTo(map);

    let popupContent = `<p><strong>Type:</strong> ${type}</p>`;
    if (date) popupContent += `<p><strong>Date:</strong> ${date}</p>`;
    if (description)
      popupContent += `<p><strong>Description:</strong> ${description}</p>`;
    if (image)
      popupContent += `<img src="${image}" alt="Image" style="width:100px;height:auto;"/>`;

    marker.bindPopup(popupContent).openPopup();

    if (save) {
      let mapMarkers = JSON.parse(localStorage.getItem("mapMarkers")) || [];
      mapMarkers.push({ lat, lng, type, date, description, image });
      saveMarkers(mapMarkers);
    }
  }

  // Function to get the marker icon based on the type of litter
  function getMarkerIcon(type) {
    let iconUrl;

    if (type === "trash") {
      iconUrl =
        "https://cdn.glitch.global/e213384d-62bf-4b30-8f1f-d122d6237505/trash-can-icon-28680.png?v=1732071511097";
    } else if (type === "Dangerous Item") {
      iconUrl =
        "https://cdn.glitch.global/e213384d-62bf-4b30-8f1f-d122d6237505/%E2%80%94Pngtree%E2%80%94syringe%20needle%20layering_4364872.png?v=1732071435020";
    } else if (type === "clean") {
      iconUrl =
        "https://cdn.glitch.global/e213384d-62bf-4b30-8f1f-d122d6237505/smile-transparent-png-18.png?v=1732071565946";
    }

    return L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  loadMarkers();
}

document.addEventListener("DOMContentLoaded", () => {
  fetch('../data/map.json')
  .then(response => response.json())
  .then(jsonData => renderListing(jsonData))
  .catch(error => console.error('Error loading JSON:', error));

  function renderListing(json) {
    const listingContainer = document.querySelector("main.Listing");

    if (!listingContainer) {
      console.error("Container with class 'Listing' not found.");
      return;
    }

    // Render the main description
    const mapDescription = json["Interactive Community Map"].description;
    const descriptionEl = document.createElement("p");
    descriptionEl.textContent = mapDescription;
    descriptionEl.style.padding = "10px"; // Add 10px padding
    listingContainer.appendChild(descriptionEl);

    // Process the "Listing" section
    json.Listing.forEach((listingItem) => {
      for (const sectionTitle in listingItem) {
        // Create section header
        const sectionHeader = document.createElement("h3");
        sectionHeader.textContent = sectionTitle;
        sectionHeader.style.padding = "10px"; // Add 10px padding
        listingContainer.appendChild(sectionHeader);

        // Iterate through each subsection
        const subsections = listingItem[sectionTitle];
        const ul = document.createElement("ul"); // Create a bullet point list
        subsections.forEach((subsection) => {
          for (const key in subsection) {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${key}</strong> ${subsection[key]}`; // Bold the key and show content
            li.style.padding = "10px"; // Add 10px padding
            ul.appendChild(li);
          }
        });
        listingContainer.appendChild(ul);
      }
    });
}


  
});
