function nonEndPoint(request, response, next) {
    console.log("endpoint does not exist")
    response.status(404).send({message: "Path does not exist"})
}

function handleServerErrors(err, request, response, next){
    console.log("Error caught by handleServerErrors:", err);
    if(err.status && err.msg){
        response.status(err.status).send({ message: err.msg });
    }
    else{response.status(500).send({ message: 'Internal Server Error' });}
}

module.exports = {handleServerErrors}