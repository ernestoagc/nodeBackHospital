var express = require('express');
var app= express();
var Usuario= require('../models/usuario');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutentacion=require('../middlewares/autenticacion');

//=====================================================
// Ontener usuarios
//=====================================================

app.get('/',(req,res,next) =>{

    Usuario.find({},'nombre email img role').exec((err,usuarios)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error cargando usuarios',
                errros:err
            });;
        }

        
       res.status(200).json({
            ok:true,
            usuarios:usuarios
        });   


    });

/*

    res.status(200).json({
        ok:true,
        mensaje:'Get de usuddddarios'
    });*/
    console.log('consiguio usuarios');

});



//=====================================================
// Crear un nuevo usuario
//=====================================================
//app.post('/',mdAutentacion.verificaToken,(req,res) =>{
app.post('/',(req,res) =>{

    var body= req.body;

    var usuario= new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password,10),
        img:body.img,
        role:body.role
    });

    usuario.save( (err,usuarioGuardado) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear usuario',
                errros:err
            });;
        }

        res.status(201).json({
            ok:true,
            usuario:usuarioGuardado,
            usuariotoken:req.usuario

        });   



    });

    

});



//=====================================================
// Actualizar el usuario
//=====================================================

app.put('/:id',mdAutentacion.verificaToken,(req,res) =>{
    
    var id = req.params.id;
    var body= req.body;

    Usuario.findById( id,(err,usuario) =>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar usuario',
                errros:err
            });;
        }

        if(!usuario){
            return res.status(400).json({
                ok:false,
                mensaje:'El usuario con el id '+id+'no existe',
                errros:{message:"No existe un usuario con ese ID"}
            });;
        }

        usuario.nombre=body.nombre;
        usuario.email=body.email;
        usuario.role=body.role;

        usuario.save( (err,usuarioGuardado) =>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al buscar usuario',
                    errros:err
                });;
            }

            usuarioGuardado.password=':)';

            res.status(200).json({
                ok:true,
                body:usuarioGuardado
            });  

        });


    });


});

//=====================================================
// Eliminar el usuario
//=====================================================

app.delete('/:id',mdAutentacion.verificaToken,(req,res) =>{

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err,usuarioBorrado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar usuario',
                errros:err
            });;
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'El usuario con el id '+id+'no existe',
                errros:{message:"No existe un usuario con ese ID"}
            });;
        }
    
        res.status(201).json({
            ok:true,
            usuario:usuarioGuardado
        });   


    });

    
});

module.exports=app;