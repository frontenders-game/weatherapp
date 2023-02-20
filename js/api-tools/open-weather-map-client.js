import {GeoSuperClass} from "./basic-geo.js";

export class OpenWeatherMapClient extends GeoSuperClass {
    // https://openweathermap.org/current
    constructor(apikey, units = 'metric', lang = 'en', exclude = null) {
        super(apikey);
        this._units = units
        this._lang = lang
        this.exclude = exclude // current, minutely, hourly, daily, alerts
    }
    set lang(lang) {
        this._lang = lang
    }

    get lang() {
        return this._lang
    }

    set units(units) {
        this._units = units
    }

    get units() {
        return this._units
    }

    #getUnitsSign() {
        switch(this._units) {
            case 'metric': return '°C'
            case 'imperial': return '°F'
            default: return 'K'
        }
    }

    #getApiUrl(endpoint){
        const mainUrl = 'https://api.openweathermap.org/data/2.5/'
        const geoUrl = 'https://api.openweathermap.org/geo/1.0/'
        if (endpoint === 'weather') return `${mainUrl}${endpoint}`
        if(['direct', 'reverse', 'zip'].includes(endpoint)) return `${geoUrl}${endpoint}`
        throw new TypeError('Wrong endpoint provided.')
    }

    #generateUrl(endpoint, params) {
        const url = new URL(this.#getApiUrl(endpoint))
        url.searchParams.set('appid', this.apiKey)
        for (const paramKey in params) {
            url.searchParams.set(paramKey, params[paramKey])
        }
        if (this._units) url.searchParams.set('units', this._units)
        if (this._lang) url.searchParams.set('lang', this._lang)
        if (this.exclude) url.searchParams.set('exclude', this.exclude)
        return url.href
    }

    #processWeatherJson(json){
        json.main.units = this.#getUnitsSign()
        json.main.temp = json.main.temp.toFixed(1)
        json.main.feels_like = json.main.feels_like.toFixed(1)
        return json
    }

    async getWeatherByCoordinates(lat, lon) {
        const url = this.#generateUrl('weather', {lat, lon})
        const json = await this.basicRequest(url)
        return this.#processWeatherJson(json)
    }

    async getWeatherByCity(city, limit=5) {
        const url = this.#generateUrl('direct', {q: city, limit: limit})
        return await this.basicRequest(url)
    }
}
