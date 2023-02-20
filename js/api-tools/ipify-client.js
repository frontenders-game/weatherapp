import {GeoSuperClass} from "./basic-geo.js";

export class IpifyClient extends GeoSuperClass {
    // https://geo.ipify.org/docs
    apiUrl = 'https://geo.ipify.org/api/v2/'
    endpoint = 'country,city'

    constructor(apikey, ipAddress = null) {
        super(apikey);
        this.apiKey = apikey
        this.ipAddress = ipAddress
    }

    #generateUrl() {
        const url = new URL(`${this.apiUrl}${this.endpoint}`)
        url.searchParams.set('apiKey', this.apiKey)
        if (this.ipAddress) url.searchParams.set('ipAddress', this.ipAddress)
        return url.href
    }

    async makeGeoApiRequest() {
        const url = this.#generateUrl()
        return await this.basicRequest(url)
    }

    async getLatLonFromIp() {
        const json = await this.makeGeoApiRequest()
        return {lat: json.location.lat, lon: json.location.lng}
    }

}

