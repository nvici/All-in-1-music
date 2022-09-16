


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

