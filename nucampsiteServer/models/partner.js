const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
//import

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
        
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        require:true
    }
})
   
const Partner = mongoose.model('Partner', partnerSchema );
module.exports = Partner;