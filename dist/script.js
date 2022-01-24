'use strict';

const mainCountry = document.querySelector('.main-country');
const choosenCountry = document.querySelector('.country-txt');
const btn = document.querySelector('.btn');

const renderCountry = function (data, className = '') {
  let html = `
  <div class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>🏠</span>${
        Object.values(data.capital)[0]
      }</p>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} M people</p>
      <p class="country__row"><span>🗺</span>${(data.area / 1000).toFixed(
        1
      )} thousand m²</p>
    </div>
  </div>
  `;

  mainCountry.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  mainCountry.insertAdjacentText('beforeend', msg);
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCountryData = function (country) {
  // Country 1
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      mainCountry.style.opacity = 1;
    });
};

btn.addEventListener('click', function (e) {
  e.preventDefault();

  mainCountry.innerHTML = '';
  getCountryData(choosenCountry.value);
  choosenCountry.value = '';
});
