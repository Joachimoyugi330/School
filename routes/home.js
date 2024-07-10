const express = require('express');
const router = express.Router();


// working with templates
router.get('/', (req, res)=>{
    res.render('index', {title:"School", message: "Hello"});
});

module.exports = router;
