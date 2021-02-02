const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const fs = require("fs")
const methodOverride = require("method-override")

// middleware
// this will help us use layout file
app.use(expressLayouts)

app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))

app.use(methodOverride("_method"))

// ROUTES

app.get("/", (req, res) => {
    res.send("Hello there")
})

app.get("/dinosaurs", (req, res) => {
   
    let dinos = fs.readFileSync("./dinosaurs.json")
    // take our data and make readable
    dinos = JSON.parse(dinos)
    console.log(dinos)
    let nameToFilterBy = req.query.nameFilter

    
    if (nameToFilterBy) {
        const newFilteredArray = dinos.filter((dinosaurObj) => {
           if (dinosaurObj.name === nameToFilterBy) {
               return true
           }
        })
        dinos = newFilteredArray
    }
    // in views folder, render this page
    res.render("dinosaurs/index", {dinos: dinos})
})
//new view

app.get("/dinosaurs/new", (req, res) => {
    res.render("dinosaurs/new")
})

// SHOW view
app.get("/dinosaurs/:index", (req, res) => {
    let dinos = fs.readFileSync("./dinosaurs.json")
    dinos = JSON.parse(dinos)
    console.log(dinos)
    // req.params.index
    const dino = dinos[req.params.index]
    res.render("dinosaurs/show", { dino: dino })
})


app.post("/dinosaurs", (req, res) => {
    let dinos = fs.readFileSync("./dinosaurs.json")
    dinos = JSON.parse(dinos)
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }
    dinos.push(newDino)
    fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinos))

res.redirect("/dinosaurs")

    console.log(req.body)
})

app.delete("/dinosaurs/:idx", (req, res) => {
    const dinosaurs = fs.readFileSync("./dinosaurs.json")
    const dinosaursArray = JSON.parse(dinosaurs)
    // intermediate var
    let idx = Number(req.params.idx) // comes in as string, change it to an interger with Number()
    // remove dino
    dinosaursArray.splice(idx, 1)
    // save array into json file
    fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinosaursArray))
    // redirect back to /dino route
    res.redirect("/dinosaurs")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})