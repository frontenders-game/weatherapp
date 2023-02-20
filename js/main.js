import {WeatherApiClient, IpifyApiClient} from './shared.js'
import {renderWeather, renderCityInput} from './render-html.js'


/**
 Success callback
 */
const useGeolocation = async function (position) {
    try{
        const weatherJSON = await WeatherApiClient.getWeatherByCoordinates(
            position.coords.latitude, position.coords.longitude)
        renderWeather(weatherJSON, 'Based on your geolocation.')
    }
    catch (error){
        console.warn(`Couldn\`t get weather by geolocation. Error: ${error}`)
        await useIP()
    }
}

/**
 Error callback
 */
const useIP = async function () {
    try {
        const {lat, lon} = await IpifyApiClient.getLatLonFromIp()
        const weatherJSON = await WeatherApiClient.getWeatherByCoordinates(lat, lon)
        renderWeather(weatherJSON, 'Based on your IP address.')
    }
    catch (error){
        console.warn(`Couldn\`t get weather by ip. Error: ${error}`)
        renderCityInput()
    }
}
const promptGeoLocation = function () {
    navigator.geolocation.getCurrentPosition(
        async position => await useGeolocation(position),
        async () =>  useIP())
}

promptGeoLocation()









