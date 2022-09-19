var dataName = document.querySelector('#data-name')
var searchBtn = document.getElementById('search-button');
var wikiInfo = document.querySelector('#wiki');
var infoName = document.querySelector('#data-name');
var spotifyTracks = document.querySelector('#spotify')


//module that controls API
var apiController = (function() {

    var clientId = '76ff871267734d8eb366e5fc36d123a3';
    var clientSecret = '83f701b4f51b49468196b281f125ce18';
    
    // keeps our client methods secret
    var _getToken = async () => {

        var result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        var data = await result.json();
        return data.access_token;
    }
    


    //allows _getToken to be used outside of the controller
    return {
        getToken() {
            return _getToken();
        },
    }
})();

// module that controls UI
var uiController = (function() { 
    //other public methods
    return {
        storeToken(value) {
            localStorage.setItem('token', value)
        },
        
        getStoredToken() {
            return {
                token: localStorage.getItem('token')
            }
        }
    }
    
})();

//module that controls the integration of API and UI
var appController = (function(uiCntrl, apiCntrl) {
    
    
    // Gets token on page load
    var grabToken = async () => {

        // get token
        var token = await apiCntrl.getToken();

        // store in local storage
        uiCntrl.storeToken(token);   

    }
    //When search is clicked it pops out the 2 hidden divs
    var searchBtn = document.getElementById('search-button');

    searchBtn.addEventListener('click',function(e){
        e.preventDefault()
        var appearEl = document.querySelector('.parent');
        appearEl.classList.remove('hide');
        function clearData(){
            wikiInfo.innerHTML = '',
            spotifyTracks.innerHTML = ''
        }
        
        function wikiDemo(){  //function that calls for the wikipedia API
            clearData()
            var wikiURL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + infoName.value + ' music' + '&format=json&prop=links&origin=*' 
            fetch(wikiURL)
            .then(function(response){ // .then to take the response from API.
                return response.json()
            })
            .then(function(data){
                console.log(data)
                
                var dataTop = document.createElement('h2');  //create the elements where the data can be pulled and listed from the wikiURL.
                var wikiData = document.createElement('p');
                var str = data.query.search[0].snippet;
    
                str = str.replace(/<\/?span[^>]*>/g, '');  // takes out text from the snippet that does not need to be in there.
                finalStr = str.split('.');
                wikiData.textContent = finalStr[0];
                dataTop.textContent = infoName.value + " Music"
    
                wikiInfo.append(dataTop, wikiData)
    
                var wikiLink = 'https://en.wikipedia.org/wiki/' + infoName.value + ' music'  // wikipedia link to be presented with the value from infoName. 
    
                var moreInfo = document.createElement('p');
                var linkEl = document.createElement('a');
        
                moreInfo.textContent = 'For more information please visit: ';
                linkEl.href = wikiLink;
                linkEl.textContent = wikiLink;
        
                wikiInfo.append(moreInfo, linkEl )
    
            })
        
        
        } wikiDemo()

        //calls the genre playlist on button click
        function getGenrePlaylist(){

            clearData()
            var infoNameLower = infoName.value.toLowerCase()
            var spotifyURL = 'https://api.spotify.com/v1/recommendations?seed_genres=' + infoNameLower
            var token = localStorage.getItem('token')
            fetch (spotifyURL, {
                method: 'Get',
                headers: { 'Authorization' : 'Bearer ' + token}
            })

            .then(function(response){
                return response.json()
            })

            .then(function(data){
                console.log(data);
                
                // iterates a list from the data pulled from spotify
                for (let i = 0; i < 20; i++) {
                    
                    var listEl = document.createElement('li')
                    var trackName = data.tracks[i].name
                    var artist = data.tracks[i].artists[0].name
                    var link = data.tracks[i].external_urls.spotify
                    var fullInfo = trackName + ' by ' + artist
                    var spotifyLink = document.createElement('a')
                    spotifyLink.href = link
                    spotifyLink.textContent = fullInfo
                    
                    spotifyTracks.append(listEl)
                    listEl.append(spotifyLink)
                    
                 }
            })
            

        }getGenrePlaylist()
        

        
    
    })

    //allows token to be loaded on page load
    return {
        init() {
            console.log('Starting the page');
            grabToken();
        console.log()
        }
    }
})(uiController, apiController);

//allows APP module to be utilized on page load
appController.init();

