
function moove(){    
    const text = document.querySelector('.moove');
    const strText = text.textContent;
    const splitText = strText.split("");
    text.textContent = "";
    for(let i=0; i<splitText.length;i++){
        text.innerHTML += "<span>"+ splitText[i] + "</span>"
    }

    let char = 0;
    let timer = setInterval(onTick, 50);

    function onTick(){
        const span = text.querySelectorAll('span')[char];
        span.classList.add('fade');
        char++
        if(char === splitText.length){
            complete();
            return;
        }
    }

    function complete(){
        clearInterval(timer);
        timer = null;
    }
}



//retirer l'input

function removeInput(){

    var input = document.getElementById('search');
    input.style.display = 'none';
    var button = document.getElementById('button_principal');
    button.style.display = 'none';
    var div = document.getElementById('section-form');
    div.style.display = 'none';
}

//ajouter le back

function addBack(){

    var input = document.getElementById('back');
    input.style.display = 'flex';
    var input = document.getElementById('album-list');
    input.style.display = 'block';
    var input = document.getElementById('singles-list');
    input.style.display = 'block';
}


function _getArtist(){

    valeur = document.getElementById("search").value;

    return valeur;
}


const APIController = (function() {
    
    const clientId = '6d12714866e1480c9bd09ba41f42a940';
    const clientSecret = '36af52d27c224c81b46f6d2434d5deca';

    // private methods


                                            //------RECUPERE LE TOKEN-------//

    

    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
                                            //---FIN---RECUPERE LE TOKEN-------//

    const _getArtistName = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/search?q=${_getArtist()}&type=artist&limit=1`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });


        const data = await result.json();
        
        return data;

    }

    const _getArtistPic = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/search?q=${_getArtist()}&type=artist&limit=1`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });


        const data = await result.json();
        
        return data;

    }


                                             //------RECUPERE LES INFOS DE L'ALBUM-------//



    const _getImage = async (token) => {

        const result1 = await fetch(`https://api.spotify.com/v1/search?q=${_getArtist()}&type=artist&limit=1`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });


        const data1 = await result1.json();
        
        artist = data1.artists['items'][0].id;
        
        const result = await fetch(`https://api.spotify.com/v1/artists/${artist}/albums?include_groups=album&market=US&limit=10`, 
            {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });

        const data = await result.json();
        
        return data.items;
        
    }

    const _getSingle = async (token) => {

        const result1 = await fetch(`https://api.spotify.com/v1/search?q=${_getArtist()}&type=artist&limit=1`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });


        const data1 = await result1.json();
        
        artist = data1.artists['items'][0].id;
        
        const result = await fetch(`https://api.spotify.com/v1/artists/${artist}/albums?include_groups=single&market=US`, 
            {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });

        const data = await result.json();
        
        return data.items;
        
    }


                                            //---FIN---RECUPERE LES INFOS DE L'ALBUM----FIN---//


    return {
        getToken() {
            return _getToken();
        },
        getImage(token) {
            return _getImage(token);
        },

        getArtist(){
            return _getArtist();
        },

        getArtistName(token){
            return _getArtistName(token);
        },

        getArtistPic(token){
            return _getArtistPic(token);
        },
        getSingle(token){
            return _getSingle(token);
        }

    }
    
})();



// UI Module
const UIController = (function() {


    //object to hold references to html selectors

    const DOMElements = {
        selectArtistPic: '.artist_pic',
        selectArtistName: '.artist_name',
        selectImage: '.container',
        selectSingle: '.container-singles',
        hfToken: '#hidden_token',
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                artistPic: document.querySelector(DOMElements.selectArtistPic),
                artistName: document.querySelector(DOMElements.selectArtistName),
                infos_albums: document.querySelector(DOMElements.selectInfosAlbum),
                albums: document.querySelector(DOMElements.selectAlbum),
                images: document.querySelector(DOMElements.selectImage),
                singles: document.querySelector(DOMElements.selectSingle),
                singleTitle: document.querySelector(DOMElements.selectSingleTitle)
            }
        },

        // need methods to create select list option    

        createArtistPic(text) {

            const html = `<div class="image_flow" style="background: url(${text}); height:200px; width: 200px;background-position: center;
            background-repeat: no-repeat;
            background-size: cover; border-radius: 50%;"></div>`;
            document.querySelector(DOMElements.selectArtistPic).insertAdjacentHTML('beforeend', html);
              
        },
        
        
        createArtistName(text) {
            
            const html = `<div class="name"><h1>${text}</h1></div>`;
            document.querySelector(DOMElements.selectArtistName).insertAdjacentHTML('beforeend', html);
              
        },

        createInfosAlbum(text,x) {

            const DOMElements = {
                selectAlbum: `.album_infos-${x}`,
            }

            const html = `<p class="date_album">${text}</h2></p>`;
            document.querySelector(DOMElements.selectAlbum).insertAdjacentHTML('beforeend', html);
        },


        createAlbum(text,x) {

            const DOMElements = {
                selectAlbum: `.album-${x}`,
            }

            const html = `<div class="album_infos album_infos-${x}"><h2 style="overflow: hidden;">${text}</h2></div>`;
            document.querySelector(DOMElements.selectAlbum).insertAdjacentHTML('beforeend', html);
        },



        createImage(text,x) {

            const html = `<div class="album album-${x}"><div class="block block-${x}" style="background: url(${text}) no-repeat 50% 50%; background-size: cover;"></div></div>`;
            document.querySelector(DOMElements.selectImage).insertAdjacentHTML('beforeend', html);
              
        },

        createSingleTitle(text,x) {

            const DOMElements = {
                selectSingleTitle: `.single-${x}`,
            }

            const html = `<div class="single_infos single_infos-${x}"><h2 style="overflow: hidden;">${text}</h2></div>`;
            document.querySelector(DOMElements.selectSingleTitle).insertAdjacentHTML('beforeend', html);
        },

        createImageSingle(text,x) {

            const html = `<div class="single single-${x}"><div class="block block-${x}" style="background: url(${text}) no-repeat 50% 50%; background-size: cover;"></div></div>`;
            document.querySelector(DOMElements.selectSingle).insertAdjacentHTML('beforeend', html);
              
        },

        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }

        
    }


})();



const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load

    const loadArtistName = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);

        //get the genres
        const artistName = await APICtrl.getArtistName(token);
        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        artistName == UICtrl.createArtistName(artistName.artists.items[0].name);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       //-----------ICI ON AJOUTE LA VALEUR x QUI VA INCREMENTER NOS CLASS--------//
        //let x=0;
       //image.forEach(element => {
           
        //x++;
        //UICtrl.createImage(element.images[0].url,x)});
       
    }

    const loadArtistPic = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);

        //get the genres
        const artistPic = await APICtrl.getArtistPic(token);
        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        artistPic == UICtrl.createArtistPic(artistPic.artists.items[0].images[0].url);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       //-----------ICI ON AJOUTE LA VALEUR x QUI VA INCREMENTER NOS CLASS--------//
        //let x=0;
       //image.forEach(element => {
           
        //x++;
        //UICtrl.createImage(element.images[0].url,x)});
       
    }
    

    const loadImage = async () => {

        //------TOKEN------//

        //On récupère le token
        const token = await APICtrl.getToken();           
        //On stoque le token dans la page
        UICtrl.storeToken(token);
        //---FIN---TOKEN---FIN---//


        //On recupère les Images des Albums
        const album = await APICtrl.getImage(token);
        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        //image == UICtrl.createImage(image.items[0].images[0].url);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       //-----------ICI ON AJOUTE LA VALEUR x QUI VA INCREMENTER NOS CLASS--------//

        let x=0;
        let j = 0;
        var tab = new Array();

        for(let i=1; i<album.length;i++){
            
            if((album[i].name).toUpperCase() == (album[i-1].name).toUpperCase() || album[i].images[0].url == album[i-1].images[0].url){
                tab[j] = i;
                j++;
            }
        }

        for(let k=0;k<tab.length;k++){
            delete album[tab[k]];
        }
        
       var album_filtre = album.filter(function(val){
           if(val == '' || val == NaN || val == undefined || val == null){
               return false;
           }
           return true;
       });
       album_filtre.forEach(element => {
           
        x++;
        UICtrl.createImage(element.images[0].url,x)});


        //---------ICI ON S'OCCUPE DES TITRES DES ALBUMS--------//

        //On récupère nos titres
        //const album = await APICtrl.getImage(token);
        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        //album == UICtrl.createAlbum(album.name);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       x =0;
       

       album_filtre.forEach(element => {
            x++;

            UICtrl.createAlbum(element.name,x)
        });



        //---------ICI ON S'OCCUPE DES Infos DES ALBUMS--------//

        //On récupère nos titres
        //const albumInfos = await APICtrl.getImage(token);
        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        //album == UICtrl.createAlbum(album.name);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       x =0;
       album_filtre.forEach(element => {
            x++;
            UICtrl.createInfosAlbum(element.release_date,x)});
       
    }

    const loadImageSingle = async () => {

        //------TOKEN------//

        //On récupère le token
        const token = await APICtrl.getToken();           
        //On stoque le token dans la page
        UICtrl.storeToken(token);
        //---FIN---TOKEN---FIN---//


        //On recupère les Images des Albums
        const image = await APICtrl.getSingle(token);
        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        //image == UICtrl.createImage(image.items[0].images[0].url);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       //-----------ICI ON AJOUTE LA VALEUR x QUI VA INCREMENTER NOS CLASS--------//
        let x=0;
        let j = 0;
        var tab = new Array();

        for(let i=1; i<image.length;i++){
            
            if((image[i].name).toUpperCase() == (image[i-1].name).toUpperCase() || image[i].images[0].url == image[i-1].images[0].url){
                tab[j] = i;
                j++;
            }
        }

        for(let k=0;k<tab.length;k++){
            delete image[tab[k]];
        }
        
       var image_filtre = image.filter(function(val){
           if(val == '' || val == NaN || val == undefined || val == null){
               return false;
           }
           return true;
       });
       image_filtre.forEach(element => {
           
        x++;
        UICtrl.createImageSingle(element.images[0].url,x)});

        //---------ICI ON S'OCCUPE DES TITRES DES SINGLES--------//

        
        //---------SI L'ON VEUT UN ELEMENT PRECIS-------------//
        //album == UICtrl.createAlbum(album.name);


       //-----------SI L'ON VEUT TOUT LES ELEMENTS-------------//
       x =0;
       image_filtre.forEach(element => {
            x++;
            UICtrl.createSingleTitle(element.name,x)});

            console.log(image_filtre);

       }

       


    return {
        init() {
            console.log('App is starting');
                
            loadArtistName();
            loadArtistPic();
            loadImage();
            loadImageSingle();           
        }
    }

})(UIController, APIController);

moove();
