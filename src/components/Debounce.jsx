import React, { useRef } from 'react'
import '../styles/Debounce.css'
import logo from '../images/location.png'
import axios from 'axios'
import { useState } from 'react'
import cloud from '../images/clouds.png'
import Modal from 'react-modal';
import PopupBox from './PopupBox'
import Loader1 from './Loader1'
import Chart from "react-apexcharts";
import { useEffect } from 'react'


  const Debounce = () => {


    let id;
    const [cities, setCities] = useState([])
    const [weather, setWeather] = useState([])
    const [display, setDisplay] = useState(true)
    const [cityName, setCityName] = useState('')
    
    const [modalIsOpen, setIsOpen] = useState(false);
    const arr = useRef([])
    
    
    const location = () => {
      axios
      .get(" https://ipinfo.io/json?token=52ed0181817dc8")
      .then((response) => {
        setCityName(response.data.city)
        WeatherFetch(response.data.city)
        localStorage.setItem('cityName', JSON.stringify(response.data.city))
      })
    }
    
    useEffect(()=>{
      location()
    },[])




    const WeatherFetch = (name) => {
      let lon; 
      let lat;

      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${name}&cnt=7&appid=5c6004fc3786d57b9d23c346916d72e5&units=metric`).then((res)=>{
        lon = res.data.city.coord.lon
        lat = res.data.city.coord.lat
      }).catch((error)=>{
        console.log('error 34:', error)
      })


    
      setTimeout(()=>{
        sevenDayas(lat, lon)
      },500)
      
      
      



    }
    const sevenDayas = (lat, lon) => {



      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`).then((res)=>{
        setWeather(res.data.daily)
        let x = res.data.daily[0].feels_like
      arr.current =  Object.values(x)


      }).catch((error)=>{
      console.log('error 42:', error)

      })
    }


    const citiesFetch = (e) => {
      const {value} = e.target

      if(value.length != 0){
        setDisplay(false)
        
        axios.get(`https://list-of-cities.herokuapp.com/cities`).then(({data})=>{
          
          let arr = data.filter((post) =>
          post.city.toLowerCase().includes(value)
            );
  
            setCities([...arr])
          }).catch((error)=>{
            console.log('error:', error)
          })
        }
        else{
        
            setDisplay(true)
          }
    }
        
        const fetchWeather = (ele) => {
          setDisplay(true)
          WeatherFetch(ele.city)
          setCityName(ele.city)
          localStorage.setItem('cityName', JSON.stringify(ele.city))
    }
    const openPopup = (data) => {

      let day = Object.values(data.feels_like)

      arr.current = day
      
      
      setIsOpen(true)
      localStorage.setItem('singleCity', JSON.stringify(data))

     
    }

    

  return (
    <>
      <div className='mainBox'>
          <div className='logoinp'>
            <input type="text" className='inpSearchBox' onChange={
              citiesFetch
            } />
            <img src={logo} alt=""  className='logo'/>
          </div>
          <div className='outputBox' style={{display: display ? "none" : 'block' }}>
            {cities.map((ele,i) => {
              return(
                <div key={i} className='cityBoxSingle'  onClick={()=>{fetchWeather(ele)}} >
                  <span className='city'>{ele.city}</span>, <span className='state'>{ele.state}</span>
                </div>
              )
            })}
          </div>
      </div>
      
      {/* ------------------------------------------------------------------------------------------- */}
            
     
     <div>

      
        <h2 style={{textAlign:'center', marginTop:'-10px'}}>{cityName}</h2>
        <div className='humiAndpre'>
          <div>
            <h3>Pressure</h3>
            <p>1010</p>
          </div>
          <div>
            <h3>Humidity</h3>
            <p>78</p>
          </div>
        </div>
      <div className='outWeatherBox'>
          {weather.map((data, i)=>{
            return(
              <div key={i} className='singleweather' onClick={()=>{
                openPopup(data)
              }}>
                  <h3  style={{margin:'0px'}}>{new Date(`${data.dt}` * 1000).toLocaleDateString("en", {weekday: "short",})}</h3>
                  <p style={{margin:'0px'}}>{data.weather[0].main}</p>
                  <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="" className='cloudImg' />
                  
                  <p className='temp'>{data.temp.min}°</p>
                   <h4 className='temp'>{data.temp.max}°</h4>
              </div>
            )
          })}
      </div>
          </div>

      {/* ---------------------------------------------------------------------------------------------- */}
          
    
    <div className="App">
      <Modal className='modalBox' isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
          <PopupBox/>
        <button class="button-38" onClick={() => setIsOpen(false)}>Close Modal</button>
      </Modal>
    </div>

    {/* ------------------------------------------------------------------------------------------ */}


  <div>


    <div className='mapGraphBox'>
      {/* <div>
      {/* <Map /> */}
      {/* </div> */}
      <div>

      <Chart id='chartData'
          type="area"
          series={[
            {
              name: "Temperature",
              data: [...arr.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter: (val) => {
              },
            },
            yaxis: {
              labels: {
                formatter: (val) => {
                  return `${Math.ceil(25)}℃`;
                },
              },
            },
            xaxis: {
              categories: ["12:00am", "6:00am", "12:00pm", "6:00pm"],
            },
          }}
        />
        </div>
      </div>

            </div>

     {/* ------------------------------------------------------------------------------------------- */}
     
     

  

    </>


              
  )
}

export default Debounce