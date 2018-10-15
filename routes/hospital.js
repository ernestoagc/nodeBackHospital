var express = require('express');
var app= express();
var Hospital= require('../models/hospital');


var mdAutentacion=require('../middlewares/autenticacion');

//=====================================================
// Ontener hospitales
//=====================================================

app.get('/',(req,res,next) =>{

    Hospital.find({}).populate('usuario','nombre email').exec((err,hospitales)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error cargando hospitales',
                errros:err
            });;
        }

        
       res.status(200).json({
            ok:true,
            hospitales:hospitales
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
// Crear un nuevo hospital
//=====================================================
app.post('/',mdAutentacion.verificaToken,(req,res) =>{

    var body= req.body;

    var hospital= new Hospital({
        nombre:body.nombre,
        usuario:req.usuario._id
    });

    hospital.save( (err,hospitalGuardado) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear hospital',
                errros:err
            });;
        }

        res.status(201).json({
            ok:true,
            hospital:hospitalGuardado

        });   



    });

    

});



//=====================================================
// Actualizar el hospital
//=====================================================

app.put('/:id',mdAutentacion.verificaToken,(req,res) =>{
    
    var id = req.params.id;
    var body= req.body;

    Hospital.findById( id,(err,hospital) =>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar hospital',
                errros:err
            });;
        }

        if(!hospital){
            return res.status(400).json({
                ok:false,
                mensaje:'El hospital con el id '+id+'no existe',
                errros:{message:"No existe un usuario con ese ID"}
            });;
        }

        hospital.nombre=body.nombre;
        hospital.usuario=req.usuario_id;
        

        hospital.save( (err,hospitalGuardado) =>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al buscar hospital',
                    errros:err
                });;
            }

            
            res.status(200).json({
                ok:true,
                body:hospitalGuardado
            });  

        });


    });


});

//=====================================================
// Eliminar el hospital
//=====================================================

app.delete('/:id',mdAutentacion.verificaToken,(req,res) =>{

    var id = req.params.id;

    hospital.findByIdAndRemove(id, (err,hospitalBorrado)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar hospital',
                errros:err
            });;
        }

        if(!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'El hospital con el id '+id+'no existe',
                errros:{message:"No existe un hospital con ese ID"}
            });;
        }
    
        res.status(201).json({
            ok:true,
            hospital:hospitalBorrado
        });   


    });

    
});

module.exports=app;