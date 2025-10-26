document.addEventListener("DOMContentLoaded", () => {
  // Fetch and render the Introduction and Listing content from home.json
  fetch('./data/home.json') 
    .then(response => response.json())
    .then(data => {
      // Create and append Introduction section
      const introductionContent = data.Introduction.description;
      const introductionDescription = document.createElement("p");
      introductionDescription.textContent = introductionContent;
      document.body.appendChild(introductionDescription);

      // Add "Our Mission" section
      const missionSection = document.createElement("section");
      const missionHeading = document.createElement("h3");
      missionHeading.textContent = "Our Mission";
      missionSection.appendChild(missionHeading);

      const missionList = document.createElement("ul");
      data.Listing[0]["Our Mission"].forEach((item) => {
        const listItem = document.createElement("li");
        const key = Object.keys(item)[0];
        listItem.textContent = `${key} ${item[key]}`;
        missionList.appendChild(listItem);
      });
      missionSection.appendChild(missionList);
      document.body.appendChild(missionSection);

      // Add "Get Involved" section
      const involvedSection = document.createElement("section");
      const involvedHeading = document.createElement("h3");
      involvedHeading.textContent = "Get Involved";
      involvedSection.appendChild(involvedHeading);

      const involvedList = document.createElement("ul");
      data.Listing[0]["Get Involved"].forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item[""];
        involvedList.appendChild(listItem);
      });
      involvedSection.appendChild(involvedList);
      document.body.appendChild(involvedSection);
    })
    .catch(error => console.error('Error loading home.json:', error));
  
});
