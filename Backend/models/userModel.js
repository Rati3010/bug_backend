const mongoose = require('mongoose');
const userSchema=({
    email:String,
    password:String,
})
const UserModel = mongoose.model('user',userSchema);

module.exports = {UserModel};