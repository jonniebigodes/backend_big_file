const express = require('express');
const cors= require('cors');
const compress= require('compression');
const bodyParser= require('body-parser');
const fs= require('fs');

const app= express()

app.use(cors())
app.use(compress())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('port', process.env.PORT || 5000)

app.get('/',(req,res)=>{
    const html = `
        <html>
          <head>
            <style>
              body {
                padding: 30px;
              }
            </style>
          </head>
          <body>
            <h1>Simple express server</h1>
            <p>I'm using Express</p>
          </body>
        </html>
      `
    res.send(html)
})
app.get('/listfiles',(req,res)=>{
    return res.status(200).json({
        listoffiles: [
          "david-mullins-1167108-unsplash",
          "divjot-ratra-698430-unsplash",
          "evan-dvorkin-1463601-unsplash",
          "israel-sundseth-1688-unsplash",
          "jeff-sheldon-3227-unsplash",
          "maria-teneva-1416232-unsplash",
          "tilen-dominik-perko-692944-unsplash",
          "timj-310824-unsplash",
        ],
      })
})


app.get('/getfile/:name',async(req,res,next)=>{
    try {
        if(!req.params.name){
            return res.status(422)
        }
        const filetosend=`./myimages/${req.params.name}.jpg`
        if (fs.existsSync(filetosend)){
            await res.download(filetosend,err=>{
                if (err){
                    return res.status(500).json({message:"Something went horribly wrong"})
                }
            })
        }
        else{
            return res.status(404).send('NOT FOUND')
        }
    } catch (error) {
        next(error)
    }
})

app.listen(app.get('port'), error => {
    if (error) {
      console.log('====================================');
      console.log(`error on server:${error}`);
      console.log('====================================');
    } else if (process.env.NODE_ENV !== 'test') {
        console.info(`server is running on port ${app.get('port')}`)
    }
})