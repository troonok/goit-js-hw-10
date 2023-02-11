import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector("#search-box");
const list = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info")

input.addEventListener('input' , debounce (onSearch , DEBOUNCE_DELAY));

function onSearch(event) {
    const name = input.value.trim();
    cleanInput();
    if (name) {
        fetchCountries(name) 
            .then(countries => {
                if (countries.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
                return;
            }
            if (countries.length > 1 && countries.length <= 10) {
                 list.innerHTML = createCountryListMarkup(countries);
                 return;
            } 
                countryInfo.innerHTML = createCountryMarkup(countries[0]);     
            })
            .catch(error => {
                        if (error.message === '404') {
                          Notify.failure('Oops, there is no country with that name');
                        } 
                        else {
                          Notify.failure('Something went wrong');
                        }})
            }
        }
    

function createCountryListMarkup(countries) {
    return countries
      .map(({ flags, name }) => `<li class='country'>
        <img class='country-flag' src='${flags.svg}' width="50">
        <p class='country-name'>${name.official}</p>
        </li>`
      )
      .join('');
  }

  function createCountryMarkup({ flags, name, capital, population, languages }) {
    return `<div class='country-header'>
                          <img class='country-flag' src='${flags.svg}'width="50">
                          <p class='country-name country-name--large'>${name.official}</p>
                      </div>
                      <ul class='meta-info' >
                          <li class='meta-info__item'><span>Capital:</span> ${capital}</li>
                          <li class='meta-info__item'><span>Population:</span> ${population}</li>
                          <li class='meta-info__item'><span>Languages:</span> ${Object.values(
                languages
              ).join(', ')}</li>
                      </ul>
      `;
  }

  function cleanInput() {
    list.innerHTML = "";
    countryInfo.innerHTML="";
  }