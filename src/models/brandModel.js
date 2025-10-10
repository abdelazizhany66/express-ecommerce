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
  },
  image:String
},
{timestamps:true}
)

const setImageURL = (doc)=>{
  if(doc.image){
    const imageURL =`${process.env.BASE_URL}/brands/${doc.image}`
    doc.image = imageURL
  }
}
//running with get & getAll & Update convert image name to url but in db save name image 
brandSchema.post('init',(doc)=>{
  setImageURL(doc)
})

//running with create convert image name to url but in db save name image 
brandSchema.post('save',(doc)=>{
 setImageURL(doc)
})

module.exports = mongoose.model('Brand',brandSchema)

