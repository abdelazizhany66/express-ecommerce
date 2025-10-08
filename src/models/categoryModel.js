const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, 'category required'],
    unique:[true,'name already exist'],
    minlength:[3,' to short category name'],
    manlength:[32,'To long categoty name']
  },
  slug:{
    type:String,
    lowercase:true
  }
},
{timestamps:true}
)


const categoryModel = mongoose.model('Category',categorySchema)

module.exports = categoryModel;