// Function to format users
function formatUsers(users) {
  let index = 0;
  return users.map((user) => ({
    id: ++index,
    gender: user.gender,
    title: user.name?.title || "",
    full_name: `${user.name?.first || ""} ${user.name?.last || ""}`.trim(),
    city: user.location?.city || "",
    state: user.location?.state || "",
    country: user.location?.country || "",
    postcode: user.location?.postcode || "",
    coordinates: {
      latitude: user.location?.coordinates?.latitude || "",
      longitude: user.location?.coordinates?.longitude || "",
    },
    timezone: {
      offset: user.location?.timezone?.offset || "",
      description: user.location?.timezone?.description || "",
    },
    email: user.email || "",
    b_date: user.dob?.date || "",
    age: user.dob?.age || 0,
    phone: user.phone || "",
    picture_large: user.picture?.large || "",
    picture_thumbnail: user.picture?.thumbnail || "",
    course: getRandomCourse(),
    favorite: Math.random() < 0.5,
    note: getRandomNote(), // Assign a random note
  }));
}

// Helper function to get a random course
function getRandomCourse() {
  const courses = [
    "Mathematics",
    "Physics",
    "English",
    "Computer Science",
    "Dancing",
    "Chess",
    "Biology",
    "Chemistry",
    "Law",
    "Art",
    "Medicine",
    "Statistics",
  ];
  return courses[Math.floor(Math.random() * courses.length)];
}

// Helper function to generate random notes
function getRandomNote() {
  const notes = [
    "An excellent teacher with years of experience.",
    "Specializes in working with beginners.",
    "Highly recommended by students.",
    "Known for engaging and fun lessons.",
    "Has a unique teaching style that inspires students.",
    "Always goes above and beyond for students.",
    "Expert in advanced topics in the subject.",
    "Patient and supportive in teaching.",
    "Has published several papers in the field.",
    "A favorite among students.",
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

// Search function for filtering users
function searchUsers(users, searchTerm) {
  const term = searchTerm.toLowerCase();
  return users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(term) ||
      user.note?.toLowerCase().includes(term) ||
      String(user.age).includes(term)
  );
}

function displayResults(results) {
  const container = document.querySelector(".container-grid");
  container.innerHTML = ""; // Clear existing content

  if (results.length === 0) {
    container.innerHTML = `<p class="no-results">No results found</p>`;
    return;
  }

  const first15Results = results.slice(0, 15); // Limit to 15 users

  first15Results.forEach((user) => {
    const userElement = `
      <div class="item-user" style="background-color: ${user.bg_color}">
        <div class="user-image">
          <img src="${user.picture_thumbnail}" class="img-avatar" alt="Avatar">
          ${
            user.favorite
              ? `<img class="star-image" src="./img/star-light.png" alt="star">`
              : ""
          }
        </div>
        <b class="name">${user.full_name}</b>
        <label class="specialty-user">${user.course}</label>
        <label class="country-user">${user.country}</label>
        <label class="note">${user.note}</label>
        <label class="age">Age: ${user.age}</label>
      </div>
    `;
    container.innerHTML += userElement;
  });
}


// DOMContentLoaded event for initializing functionality
document.addEventListener("DOMContentLoaded", () => {
  const ageFilter = document.querySelector("#age");
  const regionFilter = document.querySelector("#region");
  const sexFilter = document.querySelector("#sex");
  const photoFilter = document.querySelector("#photo-filter");
  const favoriteFilter = document.querySelector("#favorite-filter");

  let formattedUsers = []; // Holds the original users

  // Fetch and format users
  fetch("users.json")
    .then((response) => response.json())
    .then((data) => {
      formattedUsers = formatUsers(data);
      displayResults(formattedUsers); // Show all users initially
    })
    .catch((error) => console.error("Error fetching users:", error));
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector(".search-button");
  
    // Fetch users from users.json
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        const users = formatUsers(data); // Format the users
        displayResults(users); // Initially display all users
  
        // Add event listener to the search button
        searchButton.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the form from submitting
          const searchTerm = searchInput.value.trim();
          const filteredResults = searchUsers(users, searchTerm);
          displayResults(filteredResults);
        });
      })
      .catch((error) => console.error("Error fetching users:", error));
  // Add event listeners to each filter
  ageFilter.addEventListener("change", () => {
    const filtered = filterByAge(formattedUsers, ageFilter.value);
    displayResults(filtered);
  });

  regionFilter.addEventListener("change", () => {
    const filtered = filterByRegion(formattedUsers, regionFilter.value);
    displayResults(filtered);
  });

  sexFilter.addEventListener("change", () => {
    const filtered = filterBySex(formattedUsers, sexFilter.value);
    displayResults(filtered);
  });

  photoFilter.addEventListener("change", () => {
    const filtered = filterByPhoto(formattedUsers, photoFilter.checked);
    displayResults(filtered);
  });

  favoriteFilter.addEventListener("change", () => {
    const filtered = filterByFavorite(formattedUsers, favoriteFilter.checked);
    displayResults(filtered);
  });

  // Function to filter by age
  function filterByAge(users, range) {
    return users.filter((user) => {
      if (range === "18-25") return user.age >= 18 && user.age <= 25;
      if (range === "26-30") return user.age >= 26 && user.age <= 30;
      if (range === "31-36") return user.age >= 31 && user.age <= 36;
      if (range === "36-50") return user.age >= 36 && user.age <= 50;
      if (range === ">50") return user.age > 50;
      return true; // No age filter
    });
  }

  // Function to filter by region
  function filterByRegion(users, region) {
    if (region === "All") return users;
    return users.filter((user) => user.timezone.description.includes(region));
  }

  // Function to filter by sex
  function filterBySex(users, sex) {
    if (sex === "Unknown") return users;
    return users.filter((user) => user.gender === sex.toLowerCase());
  }

  // Function to filter by photo availability
  function filterByPhoto(users, hasPhoto) {
    if (!hasPhoto) return users;
    return users.filter((user) => user.picture_large); // Ensure users have a large picture
  }

  // Function to filter by favorite
  function filterByFavorite(users, isFavorite) {
    if (!isFavorite) return users;
    return users.filter((user) => user.favorite);
  }

  // Function to display results
  function displayResults(results) {
    const container = document.querySelector(".container-grid");
    container.innerHTML = ""; // Clear existing content

    if (results.length === 0) {
      container.innerHTML = `<p class="no-results">No results found</p>`;
      return;
    }

    const first15Results = results.slice(0, 20); // Limit to 15 users
    first15Results.forEach((user) => {
      const userElement = `
        <div class="item-user" style="background-color: ${user.bg_color}">
          <img src="${user.picture_thumbnail}" class="img-avatar" alt="Avatar">
          <b class="name">${user.full_name}</b>
          <label class="specialty-user">${user.course}</label>
          <label class="country-user">${user.country}</label>
          <label class="note">${user.note}</label>
          <label class="age">Age: ${user.age}</label>
        </div>
      `;
      container.innerHTML += userElement;
    });
  }

  // Get references to buttons and sections
  const catalogue1 = document.querySelector(".catalogue1");
  const catalogue2 = document.querySelector(".catalogue2");
  const catalogue3 = document.querySelector(".catalogue3");
  const catalogue4 = document.querySelector(".catalogue4");

  const topTeachersSection = document.querySelector(".top-teachers");
  const statisticsSection = document.querySelector(".statistics");
  const favoritesSection = document.querySelector(".favorites");
  const footerSection = document.querySelector(".footer");

  // Scroll to the respective sections on button click
  catalogue1.addEventListener("click", () => {
    topTeachersSection.scrollIntoView({ behavior: "smooth" });
  });

  catalogue2.addEventListener("click", () => {
    statisticsSection.scrollIntoView({ behavior: "smooth" });
  });

  catalogue3.addEventListener("click", () => {
    favoritesSection.scrollIntoView({ behavior: "smooth" });
  });

  catalogue4.addEventListener("click", () => {
    footerSection.scrollIntoView({ behavior: "smooth" });
  });
});
