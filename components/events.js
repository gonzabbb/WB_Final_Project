document.addEventListener("DOMContentLoaded", () => {
  // Fetch and render the Events and Updates content from events.json
  fetch('../data/events.json')
    .then(response => response.json())
    .then(data => {
      // Create and append Introduction section
      const introductionContent = data["Events and Updates"].description;
      const introductionDescription = document.createElement("p");
      introductionDescription.textContent = introductionContent;
      document.body.appendChild(introductionDescription);

      // Add "Upcoming Events" section
      const upcomingEventsSection = document.createElement("section");
      const upcomingEventsHeading = document.createElement("h3");
      upcomingEventsHeading.textContent = "Upcoming Events";
      upcomingEventsSection.appendChild(upcomingEventsHeading);

      const upcomingEventsList = document.createElement("ul");
      data.Listing[0]["Upcoming Events"].forEach((item) => {
        const listItem = document.createElement("li");
        const key = Object.keys(item)[0];
        const strongElement = document.createElement("strong");
        strongElement.textContent = key;
        listItem.appendChild(strongElement);
        listItem.appendChild(document.createTextNode(`: ${item[key]}`));
        upcomingEventsList.appendChild(listItem);
      });
      upcomingEventsSection.appendChild(upcomingEventsList);
      document.body.appendChild(upcomingEventsSection);

      // Add "Recent Events" section
      const recentEventsSection = document.createElement("section");
      const recentEventsHeading = document.createElement("h3");
      recentEventsHeading.textContent = "Recent Events";
      recentEventsSection.appendChild(recentEventsHeading);

      const recentEventsList = document.createElement("ul");
      data.Listing[0]["Recent Events"].forEach((item) => {
        const listItem = document.createElement("li");
        const key = Object.keys(item)[0];
        const strongElement = document.createElement("strong");
        strongElement.textContent = key;
        listItem.appendChild(strongElement);
        listItem.appendChild(document.createTextNode(`: ${item[key]}`));
        recentEventsList.appendChild(listItem);
      });
      recentEventsSection.appendChild(recentEventsList);
      document.body.appendChild(recentEventsSection);
    })
    .catch(error => console.error('Error loading events.json:', error));
});
