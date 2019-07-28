export const download = (url: string) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest() // 1 . creamos una instancia xmhttprequest que es el objeto para hacer peticiones
    xhr.responseType = "blob" // 2. vamos a indicar que el tipo de respuesta va a ser un blob
    xhr.onload = () => { // 5. una vez cargado con exito
        resolve(xhr.response) // 6. resolvemos la promesa con la respuesta que esta nos trajo
    }
    xhr.open('GET', url) // 3. abrimos la url que le pasamos a la funcion 
    xhr.send() // 4. hacemos el llamado
})