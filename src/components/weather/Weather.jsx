import React, { useState } from 'react'
import cloud from '../assets/kracko.webp';
import moon from '../assets/majoras_mask_moon.png'
import humidity from '../assets/humidity.png'
import rain from '../assets/rain.png'
import search_icon from '../assets/search.png'
import snow from '../assets/mister_frosty.png'
import snow_2 from '../assets/sub_zero.png'
import wind from '../assets/wind.png'
import windy from '../assets/fujin.webp'
import windy_2 from '../assets/wind_man.webp'
import sun from '../assets/mario_sun.png'
import Loader from '../core/loading'
import haze from '../assets/koffing.png'
import thunderstorm from '../assets/raiden.png'
import thunderstorm_2 from '../assets/blanka.png'

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    let api_key = '1d4476a39749f3f7bf65c92057a2964a'
    let cityInputField = document.querySelector('.city-input')
    if (cityInputField) {
        document.querySelector('.city-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
            search()
            }
        });
    }
    
    const search = async () => {
        setIsLoading(true)
        const element = document.getElementsByClassName("city-input")
        let city = element[0].value
        if (city === "") {
            setIsLoading(false)
            return; 
        }
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${api_key}`
        let response = await fetch(url);
        let data = await response.json();
        if (data.cod && data.cod === "404") {
            setWeatherData('error')
            setIsLoading(false)
            return
        } 
        data.image = setWeatherImage(data)
        setWeatherData(data)
        setIsLoading(false)
    }
    const setWeatherImage = (data) => {
        let conditionCode = data.weather[0].id.toString()
        let isDaytime = data.weather[0].icon.includes('d')
        let isWindy = data.wind.speed > 21
        let snowImage = Math.random() < 0.5 ? snow : snow_2;
        let windyImage = Math.random() < 0.5 ? windy : windy_2;
        let thunderstormImage = Math.random() < 0.5 ? thunderstorm : thunderstorm_2;
        if (isWindy) {
            return windyImage
        } else if (conditionCode.startsWith('2')) {
            return thunderstormImage
        } else if (conditionCode.startsWith('3') || conditionCode.startsWith('5')) {
            return rain
        } else if (conditionCode.startsWith('6')) {
            return snowImage
        } else if (conditionCode.startsWith('7')) {
            return haze
        } else if (conditionCode.startsWith('8')) {
            if (conditionCode === '800') {
                if (!isDaytime) {
                    return moon
                } else {
                    return sun
                }
            } else {
                return cloud
            }
        }
    }
    return (
        <div className='container wrapper'>
            <div className="top-bar">
                <input className="city-input" placeholder="search"></input>
                <div className="search-icon" onClick={() => {search()}}>
                <img src={search_icon} alt="" />
                </div>
            </div>
            {isLoading ? <Loader/> :<div>
            {weatherData && weatherData !== 'error' ? 
            <div>
                <div className="weather-condition">{weatherData.weather[0].main}</div>
                <div className="weather-image">
                    <img src={weatherData.image} alt="" />
                </div>
                <div className="weather-temp">{Math.round(weatherData.main.temp)}°F</div>
                <div className="weather-location">{weatherData.name}</div>
                <div className="data-container">
                    <div className="element">
                        <img src={humidity} alt="" className='icon' />
                        <div className="data">
                            <div className="humidity-percent">{weatherData.main.humidity}</div>
                            <div className="text">Humidity</div>
                        </div>
                    </div>
                    <div className="element">
                        <img src={wind} alt="" className='icon' />
                        <div className="data">
                            <div className="wind-rate">{Math.round(weatherData.wind.speed)} mph</div>
                            <div className="text">Wind Speed</div>
                        </div>
                    </div>
                </div>
            </div> : weatherData && weatherData === 'error' ? <div><div className="weather-message">Please enter a valid city.</div></div> : <div className="weather-message">Enter a city</div>}</div>}
        </div>
    )
}

export default Weather