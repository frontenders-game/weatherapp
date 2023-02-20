import emojiWeather from './weather-emojis.js'
import {WeatherApiClient} from './shared.js'

// elements
const mainBlock = document.querySelector('.main-block')

const renderWeather = function (apiObj, title) {
    const {main, name, weather} = apiObj
    mainBlock.innerHTML = ''
    const data = [
        // [className, textContent, title]
        ['temperature__degrees', `${main.temp}${main.units}`, title],
        ['temperature__subtext',
            `${emojiWeather(weather[0].description)} feels like: ${main.feels_like}${main.units}`, title],
        ['temperature__city', name, title],
        ['temperature__change-city', 'Change city', 'Press to check weather in another city.']
    ]

    for (let [className, textContent, tagTitle] of data) {
        const el = document.createElement('p')
        el.className = className
        el.textContent = textContent
        el.title = tagTitle
        mainBlock.appendChild(el)
    }
    const city = mainBlock.querySelector('.temperature__change-city')
    city.addEventListener('click', () => renderCityInput())
}

const callbackFindByCity = async function (event) {
    event.preventDefault()
    const input = mainBlock.querySelector('#input')
    const lat = input.dataset.lat
    const lon = input.dataset.lon
    if (lat && lon) {
        try {
            const weatherJSON = await WeatherApiClient.getWeatherByCoordinates(lat, lon)
            renderWeather(weatherJSON, 'Based on your city choice.')
        } catch (error) {
            console.warn(`Couldn\`t get weather by city. Error: ${error}`)
            renderError(error)
        }
    }
}


const renderCityInput = function () {
    mainBlock.innerHTML =
        `<form action="" class="city-form">
            <label class="city-input__label" title="Type your city and press Find">
                <input class="city-input__field" id="input" placeholder="Type your city here" type="text">
            </label>
            <ul class="city__select"></ul>
            <label title="Press find button">
                <button class="main__button" title="Press find button" type="submit">Find</button>
            </label>
        </form>`
    const inputField = mainBlock.querySelector('#input')
    inputField.focus()
    inputField.addEventListener('input', event => renderCitySelector(event))
    const findBtn = mainBlock.querySelector('.main__button')
    // listeners
    findBtn.addEventListener('click', async event => await callbackFindByCity(event))
    inputField.addEventListener('keydown', async event => {
        if (event.code === 'Enter') await callbackFindByCity(event)
        else if (event.code === 'Escape') renderCityInput()
    })
}

const renderDropdownCity = function (cityObj) {
    const cityOption = document.createElement('li')
    cityOption.className = 'city__option'
    cityOption.innerHTML = `<span>${cityObj.name}</span><span>${cityObj.country}</span>`
    cityOption.dataset.name = cityObj.name
    cityOption.dataset.country = cityObj.country
    cityOption.dataset.lat = cityObj.lat
    cityOption.dataset.lon = cityObj.lon
    return cityOption
}


const renderCitySelector = async function (event) {
    const cityUl = mainBlock.querySelector('.city__select')
    cityUl.innerHTML = ''
    const city = event.currentTarget.value.trim()
    if (city.length > 2) {
        const cities = await WeatherApiClient.getWeatherByCity(city)
        if (cities.length === 0) return
        for (const cityObj of cities) {
            const cityLi = cityUl.appendChild(renderDropdownCity(cityObj))
            cityLi.addEventListener('click', event => {
                const city = event.currentTarget
                const inputField = mainBlock.querySelector('#input')
                inputField.value = `${city.dataset.name}, ${city.dataset.country}`
                inputField.dataset.lat = city.dataset.lat
                inputField.dataset.lon = city.dataset.lon
                cityUl.innerHTML = ''
            })
        }
    }
}


const renderError = function (err) {
    mainBlock.innerHTML =
        `<p class="error__title">'Ooops. Something went wrong.'</p>
        <p class="error__message">${err.message}</p>
        <label title="Press try again button">
            <button class="main__button" title="Press try again button" type="submit">Try again</button>
        </label>`
    const tryAgainBtn = mainBlock.querySelector('.main__button')
    tryAgainBtn.addEventListener('click', (event) => {
        event.preventDefault()
        renderCityInput()
    })
}

export {
    renderWeather,
    renderCityInput,
    renderError
}