const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//   middleware
router.use(bodyParser.urlencoded({ extended: false }));


const secret = process.env.SECRET

router.post('/register', (req, res) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        email: req.body.email,
        password: hashedPassword
    },
        (err, user) => {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            const token = jwt.sign({ id: user._id }, secret, {
                expiresIn: 86400
            });
            res.status(200).send({ auth: true, token: token });
        });
});



router.post('/login', async (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send('internal server error');
        if (!user) return res.status(404).send('no user found');

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token });
    });

});

module.exports = router