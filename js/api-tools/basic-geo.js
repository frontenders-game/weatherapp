export class GeoSuperClass {
    constructor(apikey) {
        this.apiKey = apikey
    }

    async basicRequest(url) {
        let json
        try {
            const response = await fetch(url);
            json = await response.json();
        } catch (error) {
            console.log('There was an error', error);
        }
        return json
    }
}
