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
    { opacity: 1 }
  );

  // Add layer control for toggling thermal overlay
  var overlays = {
    "Thermal Overlay": thermalOverlay,
  };

  L.control.layers(null, overlays).addTo(map);

  // Define polygon coordinates
  var polygonCoordinates = [
    [40.8507, -73.935371],
    [40.850818, -73.935328],
    [40.84878, -73.93036],
    [40.8486, -73.93048],
  ];

  var diagonalPolygon = L.polygon(polygonCoordinates, {
    color: "purple",
    weight: 2,
    fill: true,
  }).addTo(map);

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
        false
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
      if (addImage) {
        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.addEventListener("change", function () {
          const file = imageInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              resizeImage(e.target.result, 400, 400) // Resize to 400x400px
                .then((resizedImage) => {
                  addMarker(lat, lng, markerType, date, description, resizedImage);
                })
                .catch((error) => {
                  console.error("Image processing failed:", error);
                  alert("Failed to process the image. Marker will be saved without it.");
                  addMarker(lat, lng, markerType, date, description, null);
                });
            };
            reader.readAsDataURL(file);
          }
        });
        imageInput.click();
      } else {
        addMarker(lat, lng, markerType, date, description, null);
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

  // Function to resize an image to a specific dimension and return a Base64 string
  function resizeImage(base64Image, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate the new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress the image (70% quality)
      };
      img.onerror = reject;
      img.src = base64Image;
    });
  }

  loadMarkers();
}
