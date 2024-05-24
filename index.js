const apiUrl = "https://restcountries.com/v3.1/all";

document.addEventListener("DOMContentLoaded", () => {
  const countriesContainer = document.getElementById("countries-container");
  const searchInput = document.getElementById("search");
  const regionFilter = document.getElementById("region-filter");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  });

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCountries(data);
      setupFilters(data);
    })
    .catch((error) => console.error("Error fetching countries:", error));

  const displayCountries = (countries) => {
    countriesContainer.innerHTML = "";
    countries.forEach((country) => {
      const countryElement = document.createElement("div");
      countryElement.className = "country";
      countryElement.innerHTML = `
                <h3>${country.name.common}</h3>
                <img src="${country.flags?.png}" alt="Flag of ${
        country.name.common
      }">
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
                <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
            `;
      countryElement.addEventListener("click", () => {
        localStorage.setItem("selectedCountry", JSON.stringify(country));
        window.location.href = "detail.html";
      });
      countriesContainer.appendChild(countryElement);
    });
  };

  const setupFilters = (countries) => {
    searchInput.addEventListener("input", () => {
      const filteredCountries = countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(searchInput.value.toLowerCase())
      );
      displayCountries(filteredCountries);
    });

    regionFilter.addEventListener("change", () => {
      const filteredCountries = countries.filter((country) =>
        regionFilter.value ? country.region === regionFilter.value : true
      );
      displayCountries(filteredCountries);
    });
  };
});

if (window.location.pathname.includes("detail.html")) {
  const countryDetail = document.getElementById("country-detail");
  const selectedCountry = JSON.parse(localStorage.getItem("selectedCountry"));

  if (selectedCountry) {
    countryDetail.innerHTML = `
            <h2>${selectedCountry.name.common}</h2>
            <img src="${selectedCountry.flags?.png}" alt="Flag of ${
      selectedCountry.name.common
    }">
            <p>Population: ${selectedCountry.population.toLocaleString()}</p>
            <p>Region: ${selectedCountry.region}</p>
            <p>Capital: ${
              selectedCountry.capital ? selectedCountry.capital[0] : "N/A"
            }</p>
            <p>Subregion: ${selectedCountry.subregion}</p>
            <p>Borders: ${
              selectedCountry.borders
                ? selectedCountry.borders.join(", ")
                : "None"
            }</p>
        `;

    if (selectedCountry.borders) {
      selectedCountry.borders.forEach((border) => {
        const borderCountryElement = document.createElement("span");
        borderCountryElement.className = "border-country";
        borderCountryElement.innerHTML = border;
        borderCountryElement.style.cursor = "pointer";
        borderCountryElement.style.marginRight = "10px";
        borderCountryElement.addEventListener("click", () => {
          fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then((response) => response.json())
            .then((data) => {
              localStorage.setItem("selectedCountry", JSON.stringify(data[0]));
              window.location.reload();
            });
        });
        countryDetail.appendChild(borderCountryElement);
      });
    }
  } else {
    countryDetail.innerHTML = "<p>No country selected</p>";
  }

  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  });
}
