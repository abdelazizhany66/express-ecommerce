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
  },
  image:String
},
{timestamps:true}
)

const setImageURL = (doc)=>{
  if(doc.image){
    const imageURL =`${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageURL
  }
}
//running with get & getAll & Update convert image name to url but in db save name image 
categorySchema.post('init',(doc)=>{
  setImageURL(doc)
})

//running with create convert image name to url but in db save name image 
categorySchema.post('save',(doc)=>{
 setImageURL(doc)
})

module.exports = mongoose.model('Category',categorySchema)