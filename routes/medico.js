var express = require('express');
var app= express();
var Medico= require('../models/medico');


var mdAutentacion=require('../middlewares/autenticacion');

//=====================================================
// Ontener medicos
//=====================================================

app.get('/',(req,res,next) =>{

    Medico.find({}).populate('usuario','nombre email').populate('hospital').exec((err,medicos)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error cargando medicos',
                errros:err
            });;
        }

        
       res.status(200).json({
            ok:true,
            medicoes:medicoes
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
// Crear un nuevo medico
//=====================================================
app.post('/',mdAutentacion.verificaToken,(req,res) =>{

    var body= req.body;

    var medico= new Medico({
        nombre:body.nombre,
        usuario:req.usuario._id,
        hospital:body.hospital
    });

    medico.save( (err,medicoGuardado) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear medico',
                errros:err
            });;
        }

        res.status(201).json({
            ok:true,
            medico:medicoGuardado

        });   



    });

    

});



//=====================================================
// Actualizar el medico
//=====================================================

app.put('/:id',mdAutentacion.verificaToken,(req,res) =>{
    
    var id = req.params.id;
    var body= req.body;

    Medico.findById( id,(err,medico) =>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar medico',
                errros:err
            });;
        }

        if(!medico){
            return res.status(400).json({
                ok:false,
                mensaje:'El medico con el id '+id+'no existe',
                errros:{message:"No existe un usuario con ese ID"}
            });;
        }

        medico.nombre=body.nombre;
        medico.usuario=req.usuario_id;
        medico.hospital=body.hospital._id
        

        medico.save( (err,medicoGuardado) =>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al buscar medico',
                    errros:err
                });;
            }

            
            res.status(200).json({
                ok:true,
                body:medicoGuardado
            });  

        });


    });


});

//=====================================================
// Eliminar el medico
//=====================================================

app.delete('/:id',mdAutentacion.verificaToken,(req,res) =>{

    var id = req.params.id;

    medico.findByIdAndRemove(id, (err,medicoBorrado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar medico',
                errros:err
            });;
        }

        if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'El medico con el id '+id+'no existe',
                errros:{message:"No existe un medico con ese ID"}
            });;
        }
    
        res.status(201).json({
            ok:true,
            medico:medicoBorrado
        });   


    });

    
});

module.exports=app;