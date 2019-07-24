const express = require('express');
const router = express.Router();


async function onViewLogin(req, res) {
    res.render('login');
}

router.get('/login/', onViewLogin);

router.post('/register/',(req, res) => {
    console.log('user in session')
    console.log(req.session);
    //先查询有没有这个user
    console.log("req.body"+req.body);
    var UserName = req.body.username;
    var UserPsw = req.body.password;
    //通过账号验证
    var updatestr = {username: UserName};
    res.setHeader('Content-type','application/json;charset=utf-8')
    console.log(updatestr);
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 0){
                insert(UserName,UserPsw);
                res.send({status:'success',message:'true'})
            }else{
                res.send({status:'success',message:'false'})
            }
        }
    })
});

module.exports = router;
