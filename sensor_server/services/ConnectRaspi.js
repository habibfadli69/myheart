const axios = require('axios');
const ConnectRaspi = {
    createInitial: async(id)=>{
        let result = await axios.post('http://10.8.0.6:3000/raspi/perangkat/create', {
            idPerangkatOnServer: id
          })
        return result
    }
}
module.exports = ConnectRaspi