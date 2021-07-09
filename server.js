const express = require("express");
const cors = require("cors");
const messages = require("./messages.json")
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

//read all messages
app.get("/messages", (request,response) => {
  response.json(messages);
});

//search by a query term
function search(text) {
  return messages.filter(el => el.text.toLowerCase().includes(text.toLowerCase()));
}

app.get("/messages/search", function(request, response) {
  const searchWord = request.query.word;
  const result = search(searchWord);
  response.send(result);
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


//Create a message
app.post("/messages", (request,response) => {
  const newMessage = {
    id: request.body.id,
    From: request.body.From,
    text: request.body.text
  };
  if(!newMessage.id || !newMessage.From || !newMessage.text) {
    response.status(400).send(`Please include either Id, From or text`);
  }
  messages.push(newMessage);
  response.json(messages);
});

// update a message
app.put("/messages/:id", (request,response) => {
  const {id} = request.params;
  const match = messages.some(el => el.id === parseInt(id) );

  if(match) {
    const updateMessage = request.body;
    messages.forEach(el => {
      if(el.id === parseInt(id)) {
        el.From ? updateMessage.From : el.From;
        el.text ? updateMessage.text : el.text;
        response.json({msg: "Message updated", el})
      }
    });
   } else {
    response.status(400).send(`Id: ${id} not found`)
  };
});

//delete a message
app.delete("/messages/:id", (request,response) => {
  const id = request.params.id;
  console.log(id)

  const match = messages.some(el => el.id === parseInt(id) );
  console.log(match);
  if(match){
    response.json({msg: `Id:${id} deleted`})
  } else {
  } response.status(400).send("message not found")

});



app.listen(process.env.PORT || 5000, function () {
  console.log("Server running");
});
