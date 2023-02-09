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
    if (name) {
        fetchCountries(name)
            .then(renderCounty)
            .catch(error => { Notify.failure("Oops, there is no country with that name") })
            .finally(() => input.reset);
    } else {
        list.innerHTML = ""
        countryInfo.innerHTML=""
        return
    } 
}

function renderCounty(country) {
    if (country.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (country.length > 1 && country.length <= 10) {
         
        for (let i = 0; i < country.length; i += 1) {
            const countriesName = country[i].name.official;
            const flags = country[i].flags.svg;  
            list.innerHTML += `<li class="country_header_big"><img src="${flags}" alt="flag of ${countriesName}" width="50" ><p class="country_name_big">${countriesName}</p>`;
            countryInfo.innerHTML =""
        }
    } else {
    const countryName = country[0].name.official;
    const flag = country[0].flags.svg;
    const capital = country[0].capital;
    const population = country[0].population;
    const languages = Object.values(country[0].languages);

        list.innerHTML = `<li class="country_header"><img src="${flag}" alt="flag of ${countryName}" width="80">
    <p class="country_name">${countryName}</p>`;
        
        countryInfo.innerHTML = `<p><span class="description_title">Capital:</span> ${capital}</p>
    <p><span class="description_title">Population:</span> ${population}</p>
    <p><span class="description_title">Languages:</span> ${languages}</p>`;
    }
}
