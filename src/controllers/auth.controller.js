const jwt = require("jsonwebtoken");
const Account = require("../models/account.model");
const bcrypt = require("bcrypt");


function AuthController() {
  this.login = async (req, res) => {
    try {
      const { password, email } = req.body;
      
      let user = await Account.findOne({
        username: email,
      });

      if (!user) {
        return res
          .status(401)
          .send({ error: "Login failed! Check authentication credentials" });
      }

      let checkPassword = bcrypt.compareSync(password, user?.password);

      if (!checkPassword) {
        return res.status(401).send({ error: "Incorrect password!" });
      }

      const accessToken = jwt.sign({ _id: user._id }, "access_token", {
        expiresIn: "1h",
      });
      res.send( { data: {user, accessToken }});
    } catch (error) {
      res.status(400).send({ error: "Login failed" });
    }
  };

  return this;
}

module.exports = AuthController();
