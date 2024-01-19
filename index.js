import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import axios from 'axios';
import https from 'https'

const app = express();

app.use(bodyParser.json());


// Ruta para generar un token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Verifica las credenciales (esto es un ejemplo simple, debes implementar tu propia lógica de autenticación)
  if (username === 'admin' && password === 'admin') {
    // Genera un token con la información del usuario
    const token = jwt.sign({ username }, "palabraSecreta", { expiresIn: '1h' });

    // Envía el token como respuesta
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});


app.get('/api/citas', (req , res) => {
    const token = req.headers.authorization;

    jwt.verify(token, "palabraSecreta", (err, decoded) => {
        if (err) {
          res.status(401).json({ message: 'Token inválido' });
        } else {
            res.json([
                {id:1, medico:"marco perez",fecha:'20/01/2024', hora:'10:30 AM'},
                {id:2, medico:"marco perez",fecha:'21/01/2024', hora:'11:00 AM'},
                {id:3, medico:"marco perez",fecha:'22/01/2024', hora:'11:30 AM'},
                {id:4, medico:"marco perez",fecha:'23/01/2024', hora:'12:00 PM'},
                {id:5, medico:"marco perez",fecha:'24/01/2024', hora:'12:30 PM'},
                {id:6, medico:"marco perez",fecha:'25/01/2024', hora:'01:00 PM'},
                {id:7, medico:"marco perez",fecha:'26/01/2024', hora:'01:30 PM'},
                {id:8, medico:"marco perez",fecha:'27/01/2024', hora:'02:00 PM'},
                {id:9, medico:"marco perez",fecha:'28/01/2024', hora:'02:30 PM'}
            ])
        }
    });
})

app.post('/api/medicos', (req, res) => {
  const doctores = [
      { "id": 0, "medico": "Dr. Deiby Cortes", "especialidad": "Odontología", "estado": "Activo" },
      { "id": 1, "medico": "Dr. Marco Pérez", "especialidad": "Odontología", "estado": "Activo" },
      { "id": 2, "medico": "Dra. Laura García", "especialidad": "Medicina General", "estado": "Inactivo" },
      { "id": 3, "medico": "Dr. Javier Rodríguez", "especialidad": "Psicología", "estado": "Activo" },
      { "id": 4, "medico": "Dra. Ana Martínez", "especialidad": "Ginecología", "estado": "Inactivo"},
      { "id": 5, "medico": "Dr. Carlos Sánchez", "especialidad": "Cardiología", "estado": "Inactivo"},
      { "id": 6, "medico": "Dra. Isabel Gómez", "especialidad": "Pediatría", "estado": "Programado"},
      { "id": 7, "medico": "Dr. Luis Mendoza", "especialidad": "Dermatología", "estado": "Programado"},
      { "id": 8, "medico": "Dra. María Torres", "especialidad": "Neurología", "estado": "Programado"},
      { "id": 9, "medico": "Dr. Patricia Ramírez", "especialidad": "Oftalmología", "estado": "Programado"}
    ]

  req.body.hiddenContext = {...doctores}
  
  let respuesta = `Los doctores son: <br> <br>`
  
  let listadoDoctores = '';
  doctores.forEach(element => {
    let doctor = `<p>Medico ${element.medico} con la especialidad ${element.especialidad} y se encuentra ${element.estado}</p> <br>` 
    listadoDoctores += doctor

  });

  respuesta += listadoDoctores
  //console.log(respuesta)

  res.send({
    "option": "true",
    "openContext": {
       "unsafeVar": 55 
    }, 
    "visibleContext": {
       "unsafeVarRO": "foo"
    },
    "hiddenContext": {
      respuesta
    }
  })
})


app.post('/api/conversacion', (req , res) => {
  const header = {
    "Authorization":"wyu_iRX9g24MMpPt4u2NNO6cPz50JNJMZS1ne3dT",
    "Content-Type":"application/json"
  }

  var raw = "{ 'text': 'salgase de la casa ' }";
  
  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  var requestOptions = {
    method: 'POST',
    headers: header,
    body: raw,
    redirect: 'follow',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  };

  axios.post("https://1911ab1a0d0549b3848a5b0a6dcd5e9b.weavy.io/api/apps/2/messages", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  //segundo servcio 
  const header2 = {
    "Authorization":"wyu_iRX9g24MMpPt4u2NNO6cPz50JNJMZS1ne3dT",
  }

  var requestOptions = {
    method: 'GET',
    headers: header2,
    redirect: 'follow',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  };

  setTimeout(async() => {
    const header2 = {
      "Authorization":"wyu_iRX9g24MMpPt4u2NNO6cPz50JNJMZS1ne3dT",
    }
  
    var requestOptions = {
      method: 'GET',
      headers: header2,
      redirect: 'follow'
    };

     const respuesta = await axios.get("https://1911ab1a0d0549b3848a5b0a6dcd5e9b.weavy.io/api/conversations/2", requestOptions)
     console.log(respuesta)

     res.send({
      "option": "true",
      "openContext": {
         "unsafeVar": 55 
      }, 
      "visibleContext": {
         "unsafeVarRO": "foo"
      },
      "hiddenContext": {
        respuesta: 'holaaaaaa'
      }
    })
  }, 3000);
})

app.listen(8080,()=>{
    console.log('Corriendo en el puerto 8080')
})