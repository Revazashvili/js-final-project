// Last searched items
let items =["Internet Cats", "Meme's", "Typing", "Space", "Rick and Morty"];

// Adding searched items to HTML
function addItems() {
    initializeSearchHistory();

    // Adding eventlisteners on updated history
    document.querySelectorAll(".btn").forEach( button => {
        button.addEventListener('click', startSearch)
    })
}

function initializeSearchHistory(){
    document.getElementById("search-history").innerHTML='';
    items.forEach(item => {
        var tag = document.createElement("button");
        tag.innerHTML = item;
        tag.value=item;
        document.getElementById("search-history").appendChild(tag).classList.add("btn", "btn-history");
    })
}

function updateSearchHistory(input){
    if(!items.includes(input)){
        items.push(input);
        items.shift();
        initializeSearchHistory();
    }
}

async function startSearch() {
    let gifsPromise;
    var input = document.getElementById("userInput").value;
    
    if(this.classList.contains("btn-history")){
        gifsPromise = DataService.getGifs(this.value);
    }

    if(this.classList.contains("btn-submit") && input !== ''){
        document.getElementById("userInput").value='';
        updateSearchHistory(input)
        gifsPromise = DataService.getGifs(input);
    }
    
    // Clicked from trends
     if(this.classList.contains("btn-trend")){
        gifsPromise = DataService.getTrends();
    }

    
    gifsPromise.then(gifs => {
        GifRenderer.render(gifs);
    });
}

// Class to fetch data
class DataService {

    static #api_key = 'LZUsjE9N2zpPI5QnY6gIBJEFpZ2opbUa';

    static getGifs(serach_string) {
        var param = {
            q: serach_string,
            api_key: this.#api_key,
            limit: 20
        };

        try {

            const fetchPromise = fetch("https://api.giphy.com/v1/gifs/search?" + new URLSearchParams(param));
            return fetchPromise.then(response => {
                return response.json();
            }).then(gifs => {
                return gifs.data;
            })

            // const response = await fetch("https://api.giphy.com/v1/gifs/search?" + new URLSearchParams(param));
            // const gifs = await response.json();
            // return gifs.data;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static getTrends() {
        var param = {
            api_key: this.#api_key,
            limit: 20
        };

        try {
            const fetchPromise = fetch("https://api.giphy.com/v1/gifs/trending?" + new URLSearchParams(param));
            return fetchPromise.then(response => {
                return response.json();
            }).then(gifs => {
                return gifs.data;
            });
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}

class GifRenderer {
    static render(gifs){
        console.log(gifs);
        let root = document.querySelector('.result-gifs');
        root.innerHTML='';
        if(gifs){
            for (let index = 0; index < gifs.length; index++) {
                root.innerHTML += this._gifToHTML(gifs[index]);            
            }
        }
    }

    static _gifToHTML(gif){
        let gifhtml='';        
            gifhtml += `
                <div class="gif">
                <img src="${gif.images.downsized.url}" alt="">
                <h4>${gif.title}</h4>
                </div>
            `;
       
        return `${gifhtml}`;
    }
}


function load() {
    addItems();

    document.getElementById('search').addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById("submit").click();
    })
}

window.addEventListener('load',load);
