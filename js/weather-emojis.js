/** Weather emojis: https://unicode-table.com/en/emoji/travel-and-places/sky-and-weather/
 description keywords based on https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
 with some additions. some unicode strings include extra padding for consistency
*/
const weatherEmojis  = [
    ['🌞', '\u{1F31E}', ['clear sky', 'clear skies', 'sunny']],
    // ['☁', '\u2601', ['cloud]],
    ['🌤', '\u{1F324} ', ['few clouds', 'scattered clouds']],
    ['⛅', '\u{26C5}', ['broken clouds', 'cloudy']],
    ['🌥', '\u{1F325} ', ['overcast clouds']],
    ['🌦', '\u{1F326} ', ['drizzle']],
    ['🌧', '\u{1F327} ', ['rain']],
    // not ideal, but slightly better than \u26C8
    ['🌩', '\u{1F329} ', ['thunderstorm', 'lightning']],
    // ['⛈', '\u{26C8}', ['thunderstorm', 'lightning']],
    ['🌨', '\u{1F328} ', ['snow', 'blizzard']],
    // not en OpenWeather description, but listed just in case
    ['💨', '\u{1F4A8}', ['wind']],
    ['🌫', '\u{1F32B} ', ['fog', 'mist', 'smoke', 'haze', 'dust', 'squalls']],
    ['🌪', '\u{1F32A} ', ['tornado']],
];

export default function emojiWeather(weather) {
    if (typeof weather !== 'string') return '';
    return weatherEmojis.find(([, , keywords]) => keywords.some((k) => weather.includes(k)))?.[1];
}