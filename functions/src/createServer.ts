import * as express from 'express'
import * as admin from 'firebase-admin'

//creamos interfaz de request que extiende de Request y sale de express
interface IRequest extends express.Request{
    user: {
        uid: string,
        email: string,
        role: string,
    }
}
// inicializamos el servicio de administracion
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()
db.settings( {timestampsInSnapshots: true} )
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
    /* app.get('/posts', (req,res) => {
        res.send('Aplica siguiente middleware')
    }) */
    
     app.get('/posts/:postId/like', async (req:IRequest, res: any) => {
         // agrego el tipo a res: "any", sino da error
        const { uid } = req.user
        const { postId } = req.params  
        // las dos ctes de arriba van a ser id. Con esto tenemos que ir a buscar dentro de 
        // firestore a ver si existe algun registro de likes y en el caso de no existir que lo cree
        // si existe que lo elimine, es todo lo que vamos a hacer.
        // -Buscamos si existe el recurso de like    
        const snaps = await db.collection('likes')
            .where('userId', '==', uid)
            .where('postId', '==', postId)
            .limit(1)
            .get()             
        const result: { id?: string } = {} 
        // Vamos a poder iterar nuestros snaps y guardar el resultado en un objeto llamado result
         // Mutamos el objeto.Puede o no traer algo. En caso de traer algo va a ser data y los mezclamos con id
        snaps.forEach(x => Object.assign(result, { ...x.data(), id: x.id }))
         // Ahora podemos consultar el id del obejto result. Si existe ya hay like (borramos) sino creamos
        //Preguntamos si existe id:
        if (result.id){
            await db.collection('likes').doc(result.id).delete()
        }        
        // En caso de no existir el resultado de id
        if (!result.id){
            await db.collection('likes').doc().set({
                userId: uid,
                postId,
                createdAt: new Date(),   
            })
        }    
        // Luego con sendStatus(204) significa que no le mandamos nada de contenido sino OK ya se 
        // efectuo correctamente la accion
        res.sendStatus(204)
    })

    app.get('/posts/:postId/share', async (req: IRequest, res: any) => {
        const { uid } = req.user
        const { postId } = req.params
        // Buscamos el post en cuestion
        const snap = await db.collection('posts').doc(postId).get()
        const post = snap.data()
        const result = await db.collection('posts').add({
            ...post,
            userId: uid,
        })
        // 2 opciones para resubir la imagen: 1. desde el servidor con firebase function
        // 2. desde el cliente. Si lo hacemos de firebase podemos agotar cuota de computo. Por eso 
        // le enviamos el id al usuario para que resuba la imagen.
        res.send({id: result.id})
    })

    return app
    // cuando se ejecute esta funcion es una aplicacion de express
}
