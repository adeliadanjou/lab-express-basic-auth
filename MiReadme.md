# Usar Bcrypt para el password:

1) npm i bcrypt
2) en auth.js:
  - const bcrypt = require('bcrypt');
  - const theSalt = 10; <--- más número, más cifrado.

3) auth/ ruta.post correspondiente al signup:

  a) primero recogemos el dato del password con el input: 
    * --> password = req.body.password;

  b) generamos la salt con el número de cifrado:
    * --> const salt = bcrypt.genSaltSync(theSalt);

  c) juntamos cifrado y contraseña:
    * --> const cryptoPassword = bcrypt.hashSync(password, salt)
  
  d) A la hora de guardar en la base de dtos con User.create({
               username,
    ---->>>  password: cryptoPassword
       }):



# ¿Cómo hacer signup?

1) crear GET signup renderizando form con los inputs deseados:
 - importante los name de los inputs, pues recogeremos los datos a través de ellos.
2) crear POST signup:
 
 a) recoger datos de inputs:
       ---> username = req.body.username
 b) para la contraseña usaremos bcrypt para cifrarla (más arriba está explicado)
 c) guardar en base de datos con la contraseña cifrada.

# ¿Cómo hacer login?

1) npm install express-session connect-mongo
  - para crear y guardar sesiones en mongo
2) en app.js requerimos esos paquetes:
  - const session    = require("express-session");
  - const MongoStore = require("connect-mongo")(session);
3) en app.js establecemos el middleware para usar sesiones en Express:
# Mucho cuidado que tiene que estar al lado de otros middelwares no abajo, si no, no funciona!!!
   - app.use(session({
     secret: "basic-auth-secret",
     cookie: { maxAge: 60000 },
     store: new MongoStore({
       mongooseConnection: mongoose.connection,
       ttl: 24 * 60 * 60 // 1 day
       })
     }));

 a) secret: la id que le damos a la sesión
 b) cookie: un objeto de la sesión en el que establecemos la duración max de la misma
 c) store: conectamos a mongo y le decimos con ttl que max lo almacene 1 dia 

4) auth.js:
   a) crear GET login con res.render de login.hbs
   b) crear POST login:

      b.1) recoger datos de inputs:
          ---> username = req.body.username
      b.2) hacer comprobaciones de que no esté vació, si lo está mostrar mensaje
      b.3) si no están vacíos: buscar en base de datos el usuario en cuestión:
           b.3.1)  usuario no existe? mensajeError no encontrado.
           b.3.2)  existe: comprobar que la contraseña sea la misma que la del input:
           -> if (bcrypt.compareSync(password, user.password)){}
               1) Si la contraseña es distinga: mensaje error
               2) si la contraseña coincide: guardar el usuario con la session:
                --->  req.session.currentUser = user
                
     