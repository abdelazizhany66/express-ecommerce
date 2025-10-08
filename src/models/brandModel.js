const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, 'brand required'],
    unique:[true,'name already exist'],
    minlength:[3,' to short brand name'],
    manlength:[32,'To long brand name']
  },
  slug:{
    type:String,
    lowercase:true
  }
},
{timestamps:true}
)


module.exports = mongoose.model('Brand',brandSchema)

