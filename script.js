

const  userTab = document.querySelector("[data-user-weather]");
const searchTab = document.querySelector("[data-search-weather]");
const userContainer = document.querySelector(".weather-container");


const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");



let oldTab = userTab;
const API_key = "import.meta.env.API_key";
oldTab.classList.add("current-tab");



function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (oldTab === searchTab) {
            // Show search form, hide others
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        } else {
            // Show "Your Weather" (grant access or weather info), hide search form
            searchForm.classList.remove("active");
            // Now check for coordinates and show the right container
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab)
})


searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab)
})

getfromSessionStorage();


//check if coordinate present in session storage
function getfromSessionStorage(){
    const localCordinate = sessionStorage.getItem("user-coordinate");

    if(!localCordinate){
        //if cordinate are not present in local storage we show grant-location-container
        grantAccessContainer.classList.add("active");
        searchForm.classList.remove("active");      // <-- Hide search bar
        userInfoContainer.classList.remove("active");
    }
    else{
        const coordinate = JSON.parse(localCordinate);
        fetchUserWeatherInfo(coordinate);
        
    }

}


async function fetchUserWeatherInfo(coordinate){
    const{lat,longi} =coordinate;
    //make grantContainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_key}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");

    }
}


// JSON strings can be converted to JSON objects using the JSON.parse() method in JavaScript and similar functions in other languages.
// JSON objects can be converted to JSON strings using the JSON.stringify() method in JavaScript and similar functions in other languages.


function renderWeatherInfo(weatherInfo){
    //we have to fetch element
   const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-wind-speed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch values 
    cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/64x48/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description ?? "No description";
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherInfo?.weather[0]?.icon}.png`;
    temp.innerHTML = weatherInfo?.main?.temp;
    windspeed.innerHTML = weatherInfo?.wind?.speed;
    humidity.innerHTML = weatherInfo?.main?.humidity;
    cloudiness.innerHTML = weatherInfo?.clouds?.all;

}



function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}


function showPosition(position){
    const userCordinate = {
        lat:position.coords.latitude,
        longi:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinate", JSON.stringify(userCordinate));
    fetchUserWeatherInfo(userCordinate);
}



const grantAccessbtn = document.querySelector("[data-grant-access]");
grantAccessbtn.addEventListener("click",getlocation); 




const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    // let cityName = searchInput.ariaValueMax;
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchweatherInfo(cityName)
    }
})


    async function fetchSearchweatherInfo(cityName){

        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        //API CALL
        try{
            // const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_key}&units=metric`);
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_key}&units=metric`);
            const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

        }
        catch(err){

        }

    }

