const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
  };


//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

//read all messages
app.get("/messages", (request,response) => {
  response.json(messages);
});

//read one message by Id
app.get("/messages/:id", (request,response) => {
  const {id} = request.params;
  console.log(id)
  const match = messages.some(el => el.id === parseInt(id) );
  console.log(match);
  if(match) {
    response.send(messages.filter(el => el.id === parseInt(id) ))
  } else {
    response.status(400).send(`Id: ${id} not found`)
  };
});
//Create a messages
app.post("/", (request,response) => {
  const newMessage = {
    id: request.body.id,
    from: request.body.from,
    text: request.body.text
  };
  messages.push(newMessage)
  response.json(messages)

})


app.listen(process.env.PORT || 5000, function () {
  console.log("Server running");
});
