//script para fetch de datos de productos

let contenido = document.querySelector('#contenido');
console.log("fetched.js", "\n contenido", contenido);

//fetch api
await fetch('http://localhost:3000/list', )
    .then(res => 
        {console.log("data fetch.js: ", res)
        res.text()
    })
    .then(data => {
        console.log("data fetch.js: ", data)
        contenido.innerHTML = data
    })
    .catch(err => console.log(err));
