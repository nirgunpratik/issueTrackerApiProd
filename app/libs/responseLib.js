/* response generation library for api */
let generate = (err, message, status, data) => {
    let response = {
      error: err,
      message: message,
      status: status,
      data: data
    }
    return response
  }
  
  let generateFileResponse = (err, message, status, fileName) => {
    let response = {
      error: err,
      message: message,
      status: status,
      data: {
        fileName: fileName
      }
    }
    return response
  }

  module.exports = {
    generate: generate,
    generateFileResponse: generateFileResponse
  }
  