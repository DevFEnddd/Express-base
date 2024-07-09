const bcrypt = require('bcrypt');
const dotenv = require('dotenv-safe');
const path = require('path');
const { fileURLToPath } = require('url');

const Account = require('../models/account.model.js');
const libphonenum = require('google-libphonenumber');

const { PhoneNumberFormat, PhoneNumberUtil } = libphonenum;

const phoneUtil = PhoneNumberUtil.getInstance();

const mongoose = require('mongoose');
const fs = require('fs');

const accountTypeEnum = require('../enums/accountType.enum.js');
const accountStatusEnum = require('../enums/accountStatus.enum.js');

dotenv.config({
  path: path.join(__dirname, './.env'),
  example: path.join(__dirname, './.env.example')
});

const vars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
};

if (vars.env === "development") {
  mongoose.set("debug", false);
}

const migrateData = async () => {
  await Account.deleteMany({});
  await createdAdminAccount();
};

const createdAdminAccount = async () => {
  const hashedPassword = bcrypt.hashSync('123456', 8);

  const phone = '0373922863';

  const number = phoneUtil.parse(phone, 'VN');

  const phoneNumber = phoneUtil.format(number, PhoneNumberFormat.E164);

  await Account.create({
    profile: {
      fullName: 'ADMIN BLATT',
      email: 'admin@blattbild.de',
      avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg'
    },
    username: 'admin@blattbild.de',
    phone: phoneNumber,
    password: hashedPassword,
    type: accountTypeEnum.ADMIN,
    authentication: {
      isCreatedPassword: true,
      isPhoneVerified: true
    },
    status: accountStatusEnum.ACTIVE,
  });
};

mongoose
  .connect(vars.mongo.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected...");

    console.log("[/] Waiting for migration begin...");
    setTimeout(() => {
      console.log("done");

      migrateData();
    }, 3000);
  })
  .catch((err) => console.log(err));
