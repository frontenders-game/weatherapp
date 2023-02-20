import {OpenWeatherMapClient} from "./api-tools/open-weather-map-client.js";
import {IpifyClient} from "./api-tools/ipify-client.js";
import {IPIFY_KEY, OWM_KEY} from "./api-tools/config.js";


// api clients
const WeatherApiClient = new OpenWeatherMapClient(OWM_KEY)
const IpifyApiClient = new IpifyClient(IPIFY_KEY)

export {
    WeatherApiClient,
    IpifyApiClient
}