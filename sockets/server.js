const express = require('express');
const app = express();

const http = require('http');

const server = http.createServer(app);

server.listen(3000);

app.use(express.static('public'));

const socketIo = require('socket.io');
const io = socketIo.listen(server);

UserOnId = new Array();
IdsOnUser = new Array();

io.on('connect', function(socket){
	console.log('nueva conexion id: '+socket.id);

	socket.on('datos_usuario', function(datos){
            usuario = datos.usuario;
            id_socket = socket.id;
            UserOnId[id_socket] = usuario;
            
            if(IdsOnUser[usuario] == null){
                IdsOnUser[usuario] = new Array();
            }
            IdsOnUser[usuario].push(id_socket);
            
            console.log('USUARIOS ONLINE');
            console.log('-------usuario por id--------');
            console.log(UserOnId);
            console.log('-------Ids por usuarios-------');
            console.log(IdsOnUser);
            console.log('-------cantidad de users online------');
            console.log(Object.keys(IdsOnUser).length);
            console.log('-----------------------------');
            
            console.log('correo: '+datos.correo + ' usuario: '+usuario+' id_socket: ' + id_socket);
            io.emit('nuevo_usuario', {user: datos.usuario});
	});

	socket.on('send_mensaje', function(datos){
                if(datos.destinatario != null){
                    console.log(datos.usuario + ' esta enviando un mensaje en especifico');
                    destinatario = datos.destinatario;
                    id_onlines = IdsOnUser[destinatario];
                    for(var i = 0; i < id_onlines.length; i++){
                        console.log(id_onlines[i]);
                        io.to(id_onlines[i]).emit('nuevo_mensaje', {user: datos.usuario, mensaje: datos.mensaje});
                    }
                }else{
                    console.log(datos.usuario + ' esta enviando un mensaje');
                    io.emit('nuevo_mensaje', {user: datos.usuario, mensaje: datos.mensaje});
                }
	});
        
        socket.on('disconnect', function(){
            id_user = socket.id;
            
            if(UserOnId[id_user]){
                usuario = UserOnId[id_user];
            
                delete UserOnId[id_user];

                array_ids = IdsOnUser[usuario];

                for (var i = 0; i < array_ids.length; i++) {
                    if(id_user == array_ids[i]){
                        id_to_borrar = i;
                    }
                }

                IdsOnUser[usuario].splice(id_to_borrar, 1);

                if(IdsOnUser[usuario].length < 1){
                    delete(IdsOnUser[usuario]);
                }

                console.log('usuario: '+usuario+' desconectandose');
                console.log('USUARIOS ONLINE');
                console.log('-------usuario por id--------');
                console.log(UserOnId);
                console.log('-------Ids por usuarios-------');
                console.log(IdsOnUser);
                console.log('-------cantidad de users online------');
                console.log(Object.keys(IdsOnUser).length);
                console.log('-----------------------------');
            }
            
            
        });

});