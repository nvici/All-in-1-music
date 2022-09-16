var wikiInfo = document.querySelector('#wiki');
var infoName = document.querySelector('#data-name');



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
    
    var _getGenres = async (token) => {

        var result = await fetch('https://api.spotify.com/v1/recommendations', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        return data;
    }


    return {
        getToken() {
            return _getToken();
        },

        getGenres() {
            return _getGenres();
        }

    }
})();

// UI Module

var uiController = (function() {


    // holds token and input field as objects
    var domElements = {
        hftoken: '#hidden_token',
        genre: '#'
    }

    
    //other public methods
    return {
        storeToken(value) {
            document.querySelector(domElements.hftoken).value = value;
        },
        
        getStoredToken() {
            return {
                token: document.querySelector(domElements.hftoken).value
            }
        }
    }
    
})();

var appController = (function(uiCntrl, apiCntrl) {
    
    // gets input field info
    // var domInputs = uiCntrl.inputField();
    
    // Gets token on page load
    var grabToken = async () => {
        // get token
        var token = await apiCntrl.getToken();
        // store on page
        uiCntrl.storeToken(token);
        
        
        
    }
    
    var searchBtn = document.getElementById('search-button');

    searchBtn.addEventListener('click',function(e){
        e.preventDefault()
        var appearEl = document.querySelector('.parent');
        appearEl.classList.remove('hide');

        function wikiDemo(){
            var wikiURL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + infoName.value + ' music' + '&format=json&prop=links&origin=*'
            fetch(wikiURL)
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                console.log(data)
                
                var dataTop = document.createElement('h2');
                var wikiData = document.createElement('p');
                var str = data.query.search[0].snippet;
    
                str= str.replace(/<\/?span[^>]*>/g, '');
                finalStr = str.split('.');
                wikiData.textContent = finalStr[0];
                dataTop.textContent = infoName.value + " Music"
    
                wikiInfo.append(dataTop, wikiData)
    
                var wikiLink = 'https://en.wikipedia.org/wiki/' + infoName.value + ' music'
    
                var moreInfo = document.createElement('p');
                var linkEl = document.createElement('a');
        
                moreInfo.textContent = 'For more information please visit: ';
                linkEl.href = wikiLink;
                linkEl.textContent = wikiLink;
        
                wikiInfo.append(moreInfo, linkEl )
    
            })
    
    
        } wikiDemo();
    

    })

    return {
        init() {
            console.log('Starting the page');
            grabToken();
        console.log()
        }
    }
})(uiController, apiController);

console.log()
appController.init();



