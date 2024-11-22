document.addEventListener("DOMContentLoaded", () => {
  // Add custom styles for links
  const style = document.createElement("style");
  style.textContent = `
    a {
      color: inherit; /* Keeps the text color same as surrounding text */
      text-decoration: none; /* Removes the underline */
    }
    a:hover {
      text-decoration: underline; /* Adds underline on hover */
    }
  `;
  document.head.appendChild(style);

  // Fetch the JSON file
  fetch('../data/about.json')
    .then(response => response.json())
    .then(data => {
      // Create the main container
      const mainContainer = document.createElement("div");
      mainContainer.id = "main-container";

      // Section: History & Accomplishments
      const historySection = document.createElement("section");
      const historyHeading = document.createElement("h2");
      historyHeading.textContent = "History & Accomplishments";
      historySection.appendChild(historyHeading);

      const historyDesc1 = document.createElement("p");
      historyDesc1.textContent = data["History & Accomplishments"].desc1;
      historySection.appendChild(historyDesc1);

      const historyDesc2 = document.createElement("p");
      historyDesc2.textContent = data["History & Accomplishments"].desc2;
      historySection.appendChild(historyDesc2);

      mainContainer.appendChild(historySection);

      // Section: Our Partners
      const partnersSection = document.createElement("section");
      const partnersHeading = document.createElement("h2");
      partnersHeading.textContent = "Our Partners";
      partnersSection.appendChild(partnersHeading);

      const partnersDesc1 = document.createElement("p");
      partnersDesc1.textContent = data["Our Partners"].desc1;
      partnersSection.appendChild(partnersDesc1);

      const partnersList = document.createElement("ul");
      data["Our Partners"].partners.forEach((partner) => {
        const listItem = document.createElement("li");

        // Create link for partner
        const link = document.createElement("a");
        link.href = partner.link;
        link.target = "_blank"; // Open in a new tab
        link.textContent = partner.name;

        listItem.appendChild(link);
        partnersList.appendChild(listItem);
      });
      partnersSection.appendChild(partnersList);

      const partnersDesc2 = document.createElement("p");
      partnersDesc2.textContent = data["Our Partners"].desc2;
      partnersSection.appendChild(partnersDesc2);

      mainContainer.appendChild(partnersSection);

      // Section: Instagram
      const instagramSection = document.createElement("section");
      const instagramHeading = document.createElement("h2");
      instagramHeading.textContent = "Follow Us on Instagram:";
      instagramSection.appendChild(instagramHeading);

      const instagramLink = document.createElement("a");
      instagramLink.href = data.instagram.image.link;
      instagramLink.target = "_blank";

      const instagramImage = document.createElement("img");
      instagramImage.src = data.instagram.image.src;
      instagramImage.alt = data.instagram.image.alt;
      instagramImage.style.width = "150px"; // Adjust size as needed

      instagramLink.appendChild(instagramImage);
      instagramSection.appendChild(instagramLink);

      mainContainer.appendChild(instagramSection);

      // Append the main container to the body
      document.body.appendChild(mainContainer);
    })
    .catch(error => console.error("Error fetching about.json:", error));
});
