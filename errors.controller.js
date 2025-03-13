function nonEndPoint(request, response, next) {
    console.log("endpointdoes not exist")
    response.status(404).send({message: "Path does not exist"})
}


module.exports = nonEndPoint