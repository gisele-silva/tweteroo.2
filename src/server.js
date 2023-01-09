import express from 'express'
import cors from "cors";

const app = express()
const users = []
const tweets = []
app.use(express.json())
app.use(cors())

const PORT = 5000

app.post("/sign-up", (req, res) => {
    const dados = req.body
    console.log(dados)
    let username = dados.username
    let avatar = dados.avatar
    
    if (!avatar || !username){
        res.status(400).send({error: "Todos os campos são obrigatórios"})
        return
    } 

    const userExist = users.find((user) => user.username === username);

    if (userExist) {
        res.status(409).send({error: "Usuário já cadastrado no tweetero"})
        return
    } 
    users.push({username, avatar})

    res.status(201).send({ message: "OK" });
})

app.get("/tweets", (req, res) => {
    const dados = req.body

    const {page} = req.query

    if (page && page < 1) {
        res.status(400).send('Página inválida');
        return;
    }
    if (tweets.length <= 10) {
        const last10Tweets = tweets.slice(-10).reverse()
        return res.send(last10Tweets)
    }

    res.status(200).send([...tweets].reverse().slice((page-1)*10, page*10));
})

app.post("/tweets", (req, res) => {
    const dados = req.body
    const { user: username } = req.headers;
    let tweet = dados.tweet

    const {avatar} = users.find (user => user.username === username)
   
    if (!username || !tweet){
        res.status(400).send({message: "Todos os campos são obrigatórios"})
        return
    }
    
    tweets.push({username, tweet, avatar})
    res.status(201).send({ message: "tweet postado" })
})

app.get('tweets/:username', (req, res) => {
    const { username } = req.params
    const tweetsUser = tweets.filter((t) => t.username === username)
    res.status(200).send(tweetsUser)
})

app.listen(PORT, () => console.log("ok"))