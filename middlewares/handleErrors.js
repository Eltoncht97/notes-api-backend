module.exports = (error, request, response) => {
  console.error(error)
  console.log(error.name)
  if(error.name==='CastError'){
    response.status(400).end()
  }else {
    response.status(500).end()
  }
}