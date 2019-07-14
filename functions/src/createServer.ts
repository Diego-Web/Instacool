import * as express from 'express'
import * as admin from 'firebase-admin'

// inicializamos el servicio de administracion
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()
const auth = admin.auth() 

// exportamos por defecto una funcion la cual tiene que retornar una aplicacion de express
export default () => {
    
    // declaramos una cte app y ejecutamos express y se lo entregamos a app
    const app = express()    
    // creamos nuestro middleware de autenticacion (va seguido de la llamada a express)
    // Todos los middlewares reciben req: la peticion que hace el usuario, 
    // res: el objeto de respuesta y seguido de una funcion next.
    // next: ejecuta el siguiente middleware que se encuentra en la cadena
    // el async viene del await (uid,email)

    app.use(async(req, res, next) => {
        const token = req.headers.authorization
        if (token===undefined)
        {return}           
        try {         
            const {uid, email} = await auth.verifyIdToken(token)
            console.log('Uid: '+ uid)
            console.log('email: '+ email)
            const snap = await db.collection('users').doc(uid).get()            
            const user = snap.data() // snap trae objeto que esta en firestore y lo transformamos en data (trae rol)
            // ahora procedemos a mutar nuestro objeto de request y eso lo hacemos asi:
            Object.assign(req, {
                user: {
                    // indicamos los valores nuevos que queremos que tenga
                    ...user,
                    uid,
                    email,
                }
            })
            // req.user = 'lala' // muto el objeto de request para usarlo en otro middleware
            next()
        } catch (e) {
         // Le enviamos al usuario un mensaje de error con un codigo (status(403))
            res.status(403).send('Error al autorizar')           
        }
    }) // creamos un middleware que proteje todas las rutas que se definan de aca para abajo
    // Si este middleware no lo definimos al principio y lo hacemos despues, nuestras rutas no quedan protegidas
    // retornamos app
    // los metodos de app (app.desplega metodos) permiten generar una api rest
    app.get('/posts', (req, res)=> {
        // uso el objeto de req mutado, user='lala'
        //console.log(req.user)
        res.send("hola mundo!!- version ok")
    })
    return app
    // cuando se ejecute esta funcion es una aplicacion de express
}