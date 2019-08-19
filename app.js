// getting dom elements
const searchBox = document.querySelector('.search-box');
const outputContainer = document.querySelector('.container');
const loader = document.querySelector('.loader-box');
const modal = document.querySelector('.modal');

loader.style.display = "block";
// the state of the app
let citiesStates = [];
let searchQuery = "";
let selected = {};
let output;

// this function change the baground of the word the user search
const changeTextBg = (str) =>{
    // let rgx = new RegExp('\\b(' + searchQuery + ')\\b', 'ig');
    if(searchQuery === ""){
        return str;
    }else {
        let result = str.replace(RegExp(searchQuery, "gi"), `<span class="orange">${searchQuery}</span>`);
        return result;
    }
}

// this fuction is used to transform the popuration value
const populationFormat = (num) =>{
    const number = parseInt(num);
    return number.toLocaleString();
}

// function to diplay cards in the Dom
const displayContent = (data) => {
    
   let output = data.map(city => {
        return  `
            <div class="card">
                <div class="overlay" data-detail="${encodeURIComponent(JSON.stringify(city))}"></div>
                <ul>
                    <li class="city"><h1>City: ${changeTextBg(city.city)}</h1></li>
                    <li class="state">State: ${changeTextBg(city.state)}</li>
                    <li class="population">Population: ${populationFormat(city.population)}</li>
                    <li class="growth">Growth: <span class="${parseInt(city.growth_from_2000_to_2013.slice(0, -1)) >= 0 ? 'green' : 'red'}"> ${city.growth_from_2000_to_2013}</span></li>
                </ul>
            </div>`
    });
    if (data.length !== 0){
        outputContainer.innerHTML = output.join("");
    }else{
        outputContainer.innerHTML = "<h1 class='red'>No city found please try a new name</h1>";
    }
    
}

// this function toggle the state of the modal
const changeClassModal= () =>{
    modal.classList.toggle('hidden');
}

// this function open and add content to the modal
const selectedCity = () =>{
    changeClassModal();
    document.querySelector(".modal .city").innerHTML = `<h1>City: ${selected.city}</h1>`;
    document.querySelector(".modal .rank").innerHTML = `Rank: ${selected.rank}`;
    document.querySelector(".modal .state").innerHTML = `state: ${selected.state}`;
    document.querySelector(".modal .population").innerHTML = `Population: ${populationFormat(selected.population)}`;
    document.querySelector(".modal .growth").innerHTML = `Growth: <span class="${parseInt(selected.growth_from_2000_to_2013.slice(0, -1)) >= 0 ? 'green' : 'red'}"> ${selected.growth_from_2000_to_2013}</span>`;
    document.querySelector(".modal .coordinates").innerHTML = `Coordinate: Latitude ${selected.latitude}, Longitude ${selected.longitude}`;

}

const scrollWin = () =>{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
}

// =================== end of UI fuctions ====================== //

// validator function
const inputValidator = (str) => {

    if (!str.match(/^[a-zA-Z() ]+$/)){
        const err = "not a string";
        console.log(err);
        return err;
    }else{
        let myString = str.replace(/  +/g, ' ');
        return myString.trim();
    }

}

// fetching all data from the api to add them in citiesStates array
const getCities = () =>{
    fetch('https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json')
        .then(res => res.json())
        .then(data => {
            loader.style.display = "none";
            citiesStates = data;
            displayContent(citiesStates);
        })
        .catch(err => {
            loader.style.display = "none";
            displayContent(citiesStates);
            console.log(err);
        })
}
// am calling this function here so that when the page load it will be directly called
getCities();

//  adding event listener to the input  
searchBox.addEventListener('keyup', (e) =>{
    const inputValue = e.target.value;
    // console.log(searchQuery);
    if (inputValue === "") {
        getCities();
    }

    searchQuery = inputValidator(inputValue);

    if (searchQuery === "not a string"){

        outputContainer.innerHTML = "<h1 class='red'>Please use Letters only</h1>";
        
    }else{
        const newValue = citiesStates.filter(myCity =>{
            const city= myCity.city.toLowerCase();
            const state = myCity.state.toLowerCase();
            return city.includes(searchQuery.toLowerCase()) || state.includes(searchQuery.toLowerCase());
        });

        displayContent(newValue);
        scrollWin();
    }
});

//  adding event listener to single card to diplay its detail in a modal
outputContainer.addEventListener('click', (e) =>{
    if (!e.target.classList.contains('overlay')) return;

    let clicked = e.target.getAttribute("data-detail");
    selected = JSON.parse(decodeURIComponent(clicked));
    selectedCity();
    // console.log(selected);
    
}, false);

// adding event listener to the modal so that it can be closed
modal.addEventListener('click', (e) =>{
    if (e.target.classList.contains('modal') || e.target.classList.contains('close-btn')){
        changeClassModal();
        selected = {};
    }
});