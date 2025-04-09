import React, { useEffect,useState,useRef} from 'react'
import './Weather.css'
import search from "../assets/search-analytics.png"
import rainy from "../assets/rainy.png"
import clear_icon from "../assets/clear.png"
import cloud_icon from "../assets/cloud.png"
import drizzle_icon from "../assets/drizzle.png"
import rain_icon from "../assets/rain.png"
import snow_icon from "../assets/snow.png"
import wind_icon from "../assets/wind.png"
import humidity_icon from "../assets/humidity.png"

const Weather=()=> {
    const inputRef=useRef()
    const [weatherData,setWeatherData]=useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [searchHistory, setSearchHistory] = useState([]);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 4000);
  };
    const allIcons={
        "01d":clear_icon,
        "01n":clear_icon,
        "02d":cloud_icon,
        "02n":cloud_icon,
        "03d":cloud_icon,
        "03n":cloud_icon,
        "04d":drizzle_icon,
        "04n":drizzle_icon,
        "09d":rain_icon,
        "09n":rain_icon,
        "10d":rain_icon,
        "10n":rain_icon,
        "13d":snow_icon,
        "13n":snow_icon
    }
    const updateSearchHistory = (city) => {
        const prev = JSON.parse(localStorage.getItem('searchHistory')) || [];
        const filtered = prev.filter(item => item.toLowerCase() !== city.toLowerCase());
        const updated = [city, ...filtered].slice(0, 3); // max 3
        localStorage.setItem('searchHistory', JSON.stringify(updated));
        setSearchHistory(updated);
      };
    const fetchWeather=async(city)=>{
        if(city===""){
            showAlert("Enter the City Name","Warning");
            return;
        }
        try{
            const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
            const response=await fetch(url);
            const data=await response.json();
            if(!response.ok){
                showAlert(data.message,"error");
                return;
            }
            console.log(data)
            console.log(data.weather[0].description)
            const icon=allIcons[data.weather[0].icon||rainy]
            setWeatherData({
                humidity:data.main.humidity,
                windSpeed:data.wind.speed,
                temprature:Math.floor(data.main.temp),
                location:data.name,
                icon:icon,
                condition:data.weather[0].description
            })
            updateSearchHistory(data.name); 
        }
        catch(error){
            setWeatherData(false);
            console.log(error);
            showAlert("Something went Wrong","error")
        }
    }
    useEffect(()=>{
        fetchWeather("Jammu");
        const stored = JSON.parse(localStorage.getItem('searchHistory'));
    if (stored) setSearchHistory(stored);
    },[])

  return (
    <div className='weather'>
        {/* Custom Alert */}
      {alert.message && (
        <div className={`custom-alert ${alert.type}`}>
          <span className="alert-icon">⚠️</span>
          <span>{alert.message}</span>
          <span className="close-btn" onClick={() => setAlert({ message: '', type: '' })}>×</span>
        </div>
      )}
      {/* Search Bar */}
        <div className='search-bar'>
            <input ref={inputRef} type="text" placeholder='Search'/>
            <img src={search} alt='' onClick={()=>fetchWeather(inputRef.current.value)}/>
        </div>
        {/* Search History */}
      {searchHistory.length > 0 && (
        <div className='search-history'>
          <span>Recent:</span>
          {searchHistory.map((city, index) => (
            <button key={index} onClick={() => fetchWeather(city)}>{city}</button>
          ))}
        </div>
      )}
        {/* Weather */}
        {weatherData?<>
        <img src={weatherData.icon} alt="icon" className='weather-icon'/>
        <p className='condition'>{weatherData.condition}</p>
        <p className='temp'>{weatherData.temprature}°C</p>
        <p className='location'>{weatherData.location}</p>
        <div className='weather-data'>
            <div className='col'>
                <img src={humidity_icon} alt=''/>
                <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className='col'>
                <img src={wind_icon} alt=''/>
                <div>
                    <p>{weatherData.windSpeed}Km/h</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
        </>:null}
        
    </div>
  )
}

export default Weather