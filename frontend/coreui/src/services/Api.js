/**
 * Author : Faruq
 * List API baseUrl
 */
const deviceUrl = function(){
    return 'http://localhost:3001/api/perangkat/'
}
const userUrl = function(){
      return 'http://159.65.6.122:3000/api/user/'
    //return 'http://localhost:3000/api/user/'
}
const sapiUrl = function(){
      return 'http://159.65.6.122:3001/api/sapi/'
    //return 'http://localhost:3001/api/sapi/'
}
const intelligentUrl = function(){
    return 'http://159.65.6.122:4000/api/intelligent/'
}
module.exports = {
    deviceUrl,
    userUrl,
    sapiUrl,
    intelligentUrl
}
