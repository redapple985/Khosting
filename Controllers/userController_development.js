const formidable = require("formidable");

require("dotenv").config();
const aes256 = require("aes256");
const usermodel = require("../Models/userModel");
const { response } = require("express");
const { sign } = require("jsonwebtoken");
const path = require("path");
const { errors, IncomingForm } = require("formidable");
const interestModel = require("../Models/userInterestsModel");
require("dotenv").config();
const cryptLib = require("@skavinvarnan/cryptlib");
const interestOptionsmodel = require("../Models/InterestOptionsModel");

class UserController {
  async signup(req, res) {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (error, fields, files) => {
        if (error) {
          res
            .status(500)
            .json({ msg: "500 Internal Server Error", error: "true" });
          return;
        }

        if (fields != null) {
          const {
            userName,
            userFullName,
            userEmail,
            userPassword,
            userGender,
            userPhoneno,
            userDeviceRegisteration,
            userDeviceNameUpdate,
            userIpAddressRegisteration,
            userIpAddressUpdate,
            userPayment,
            professions,
            userAppVersion,
            coordinates_Lat,
            coordinates_Long,
            userUpdateCoordinates_lat,
            userUpdateCoordinates_lon,
            imageName,
            userPicturePath,
            userKey,
            userReputation,
            userReputationStatus,
          } = fields;

          //extra

          console.log(
            "usedevice" +
              cryptLib.decryptCipherTextWithRandomIV(
                userName,
                process.env.app_secrete,
              ),
          );
          console.log("userip" + userIpAddressRegisteration);
          console.log("username" + userName);

          const pushUserData = new usermodel({
            userName: userName,
            userFullName: userFullName,
            userEmail: userEmail,
            userGender: userGender,
            userProfession: professions,
            userPhoneNo: userPhoneno,
            userIpAddress: userIpAddressRegisteration,
            userIpAddressUpdate: userIpAddressUpdate,
            userDeviceName: userDeviceRegisteration,
            userDeviceNameUpdate: userDeviceNameUpdate,
            imageName: imageName,
            userPicturePath: userPicturePath,
            userCoordinates_lat: coordinates_Lat,
            userCoordinates_lon: coordinates_Long,
            userUpdateCoordinates_lat: userUpdateCoordinates_lat,
            userUpdateCoordinates_lon: userUpdateCoordinates_lon,
            userPassword: userPassword,
            userPayment: userPayment,
            userAppVersion: userAppVersion,
            userKey: userKey,
            userReputation: userReputation,
            userReputationStatus: userReputationStatus,
          });

          const savedData = await pushUserData
            .save()
            .then((result) => {
              if (result) {
                debugger;
                const userKeymeta =
                  result.userEmail + result.userPassword + result.userEmail;
                console.log(userKeymeta);

                const cipher = aes256.createCipher(process.env.app_secrete);
                const userkey = cipher.encrypt(
                  userKeymeta,
                  process.env.app_secrete,
                );

                usermodel
                  .findOneAndUpdate(
                    { _id: result.id },
                    { $set: { userKey: userkey } },
                    { new: "true" },
                  )
                  .then(async (result2) => {
                    // const decryptedEmail = cryptLib.decryptCipherTextWithRandomIV(result.userEmail, process.env.app_secrete)
                    const token_payload = {
                      _id: result._id,
                      UserEmail: userEmail,
                      UserName: userName,
                      Payment: userPayment,
                      msg: "success",
                    };

                    const token = await sign(
                      token_payload,
                      process.env.app_secrete,
                    );

                    const encryptkey = cryptLib.encryptPlainTextWithRandomIV(
                      userKey,
                      process.env.app_secrete,
                    );
                    const encryptId = cryptLib.encryptPlainTextWithRandomIV(
                      result._id,
                      process.env.app_secrete,
                    );

                    return res.status(200).json({
                      msg: "200 User created",
                      error: "false",
                      t: token,
                      userKey: encryptkey,
                      userName: result.userName,
                      userEmail: result.userEmail,
                      userId: encryptId,
                      userPaymentInfo: result.userPayment,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("err");
                    return res
                      .status(200)
                      .json({ msg: "Something went wrong", error: "true" });
                  });
              }
            })
            .catch((error) => {
              console.log(error);
              return res
                .status(500)
                .json({ msg: "Something went wrong", error: "true" });
            });

          //for debugging
          console.log(userName);
          //const data = await pushUserData().save()
        } else {
          return res.status(200).json({ msg: "Bad request", error: "true" });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ msg: "Something went wrong", error: "true" });
    }
  }

  sendEnv(req, res) {
    const encryptedSecrete = cryptLib.encryptPlainTextWithRandomIV(
      process.env.app_secrete,
      process.env.app_secrete_cipher_key,
    );
    res.status(200).send({ msg: encryptedSecrete || "empty", error: "false" });
  }

  Signin(req, res) {
    const form = new formidable.IncomingForm();

    try {
      form.parse(req, async (error, fields, files) => {
        if (fields != null) {
          const { userEmail, userPassword, paYment } = fields;

          const decryptedEmail = await cryptLib.decryptCipherTextWithRandomIV(
            userEmail,
            process.env.app_secrete,
          );
          const decryptPassword = await cryptLib.decryptCipherTextWithRandomIV(
            userPassword,
            process.env.app_secrete,
          );
          const decryptPayment = await cryptLib.decryptCipherTextWithRandomIV(
            paYment,
            process.env.app_secrete,
          );

          console.log(decryptedEmail);
          const isemailvalid = decryptedEmail.includes("@");
          if (isemailvalid) {
            const findUser = await usermodel.findOne({
              userEmail: decryptedEmail,
            });
            console.log(isemailvalid);

            if (!findUser) {
              return res
                .status(200)
                .json({ msg: "User Not found", error: "true" });
            } else {
              console.log("else");

              const userPasswordfromDb =
                await cryptLib.decryptCipherTextWithRandomIV(
                  findUser.userPassword,
                  process.env.app_secrete,
                );
              var ispasswordcorrect = decryptPassword === userPasswordfromDb;
              if (!ispasswordcorrect) {
                console.log(userPassword);
                console.log(findUser.userPassword);
                return res
                  .status(200)
                  .json({ msg: "Authentication Error", error: "true" });
              } else {
                const decrypteduserPayment =
                  cryptLib.decryptCipherTextWithRandomIV(
                    findUser.userPayment,
                    process.env.app_secrete,
                  );
                if (decryptPayment === decrypteduserPayment) {
                  console.log("matching payment" + findUser.userPayment);
                  await this.UpdateSiginToken(
                    findUser,
                    decryptedEmail,
                    req,
                    res,
                  );
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Authentication Error", error: "true" });
                }
              }
            }
          }
        } else {
          return res
            .status(400)
            .json({ msg: "400 Bad request", error: "true" });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: "500 Something went wrong", error: "true" });
    }
  }

  async uploadProfilePicture(req, res) {
    try {
      const cipher = aes256.createCipher(process.env.app_secrete);
      const imagePath = req.filename;
      const userName = req.userName;
      const userId = req.token._id;

      // const imagePathDecrypted = cipher.decrypt(imagePath)
      // const userNameDecrypted = cipher.decrypt(userName)
      // const useridDecrypted = cipher.decrypt(userId)

      if (imagePath != null) {
        const addImagepathToDB = await usermodel
          .findByIdAndUpdate(
            { _id: userId },
            {
              $set: {
                userPicturePath: imagePath,
                imageName: userName,
              },
            },
            { new: true },
          )
          .then((result) => {
            res.status(200).send({
              msg: "Task successful",
              error: "false",
            });
          })
          .catch((error) => {
            if (error) {
              res.status(500).send({
                msg: "Something went wrong",
                error: "true",
              });
            }
          });

        //addImagepathToDB.save()
      } else {
        res.status(500).send({
          msg: "Something went wrong",
          error: "true",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: "500 Something went wrong", error: "true" });
    }
  }

  async UpdateSiginToken(foundUser, email, req, res) {
    const token_payload = {
      _id: foundUser._id,
      UserEmail: email,
      UserName: foundUser.userName,
      Payment: foundUser.payment,
      msg: "success",
    };

    const token = await sign(token_payload, process.env.app_secrete);
    //update token

    await usermodel
      .findOneAndUpdate(
        { userEmail: foundUser.userEmail },
        { $push: { tokens: token } },
        { new: true },
      )
      .then(async (result) => {
        console.log("Signin success");

        const encryptedUserkey = cryptLib.encryptPlainTextWithRandomIV(
          result.userKey,
          process.env.app_secrete,
        );
        const encrypteduserId = cryptLib.encryptPlainTextWithRandomIV(
          result._id,
          process.env.app_secrete,
        );

        const getinterest = await interestModel.findOne({
          userId: result._id,
        });

        return res.status(200).json({
          msg: "Signin success",
          t: token,
          userKey: encryptedUserkey,
          error: "false",
          userName: result.userName,
          userEmail: result.userEmail,
          userId: encrypteduserId,
          userPaymentInfo: result.userPayment,
          interestOption: getinterest.interests,
        });
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(200)
          .send({ msg: "Something went wrong", error: "true" });
      });
  }

  async UpdateUserProfilePic(req, res) {
    try {
      const cipher = aes256.createCipher(process.env.app_secrete);
      const updateimagePath = req.filename;
      const userName = req.userName;
      const userId = req.token.id;

      const imagePathDecrypted = cipher.decrypt(imagePath);
      const userNameDecrypted = cipher.decrypt(userName);
      const useridDecrypted = cipher.decrypt(userId);

      const imageabsolutePath = path.join(
        __dirname,
        "profilepictures",
        updateimagePath,
      );

      console.log(imageabsolutePath);

      if (updateimagePath != null) {
        fs.unlinkSync(imageabsolutePath);

        const addImagepathToDB = usermodel.findByIdAndUpdate(
          { _id: userId },
          {
            $set: {
              userPicturePath: imagePath,
              imageName: userName,
            },
          },
          { new: true, strict: false },
          (err, doc) => {
            if (err) {
              res.status(200).send({
                msg: "Something went wrong",
                error: "true",
              });
            } else {
              response.status(200).send({
                msg: "Task successful",
                error: "false",
              });
            }
          },
        );

        addImagepathToDB.save();
      } else {
        res.status(200).send({
          msg: "Something went wrong",
          error: "true",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: "500 Something went wrong", error: "true" });
    }
  }

  async updateUserInfo(req, res) {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (error, fields, files) => {
        // userName,
        //     userFullName,
        //     userEmail,
        //     userPassword,
        //     userGender,
        //     userPhoneno,
        //     userDeviceRegisteration,
        //     userIpAddressRegisteration,
        //     userPayment,
        //     professions,
        //     userAppVersion,
        //     coordinates_Lat,
        //     coordinates_Long,
        //     imageName,
        //     userPicturePath,
        //     userKey

        if (error) {
          res.status(200).send({ msg: "Not found", error: "true" });
        }

        if (fields != null) {
          const {
            userName,
            userEmail,
            userFullName,
            userGender,
            userPhoneno,
            userDeviceUpdate,
            userAppVersion,
            coordinates_Lat,
            coordinates_Long,
            userIPUpdate,
          } = fields;

          console.log(userEmail);

          const id = req.token._id;
          console.log(id);
          const updateData = usermodel
            .findOneAndUpdate(
              { _id: id },
              {
                $set: {
                  userName: userName,
                  userFullName: userFullName,
                  userEmail: userEmail,
                  userGender: userGender,
                  userPhonno: userPhoneno,
                  userDeviceNameUpdate: userDeviceUpdate,
                  userIpAddressUpdate: userIPUpdate,
                  userAppVersion: userAppVersion,
                  userUpdateCoordinates_lat: coordinates_Lat,
                  userUpdateCoordinates_lon: coordinates_Long,
                },
              },
              { new: true },
            )
            .then((result) => (result) => {
              console.log("fullfilled");
              return res
                .status(200)
                .send({ msg: "User Profile data Updated", error: "false" });
            })
            .catch((error) => {
              console.log(error);
              return res
                .status(200)
                .send({ msg: "500 Something went wrong", error: "true" });
            });
        } else {
          return res
            .status(200)
            .send({ msg: "400 Bad Request", error: "true" });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .send({ msg: "500 Something went wrong", error: "true" });
    }
  }

  async AddInterests(req, res) {
    const form = new formidable.IncomingForm();
    try {
      console.log("run");
      await form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.status(200).send({ msg: "Bad request", error: "true" });
        }

        if (fields != null) {
          const { userName, payment, userInterests } = fields;

          const userid = req.token._id;

          console.log(userid);
          console.log(userInterests);

          const pushInterests = interestModel({
            userName: userName,
            payment: payment,
            userId: userid,
            interests: userInterests,
          });

          await pushInterests.save();

          if (pushInterests) {
            const userInterestId = pushInterests._id;

            usermodel
              .findOneAndUpdate(
                { _id: userid },
                { $set: { userInterestsId: userInterestId } },
                { new: true },
              )
              .then((result) => {
                return res
                  .status(200)
                  .send({ msg: "Interests added", error: "false" });
              })
              .catch((error) => {
                console.log(error);
                return res
                  .status(200)
                  .send({ msg: "500 Something went wrong", error: "true" });
              });
          }
        }
      });
    } catch (error) {
      return console.log(error);
    }
  }

  async getUserinterests(req, res) {
    const id = req.token._id;
    await usermodel
      .findOne({ _id: id })
      .then(async (resutl) => {
        const interestid = resutl.userInterestsId;
        const getinterests = await interestModel.findOne({ _id: interestid });
        console.log(getinterests.interests);
        res.status(200).send({ interests: getinterests.interests });
      })
      .catch((error) => {
        res.status(200).send({ msg: "Something went wrong", error: "true" });
        console.log(error);
      });
  }

  async AddBiometricObject(req, res) {
    const form = new formidable.IncomingForm();
    try {
      await form.parse(req, async (error, fields, files) => {
        const { biometricObject } = fields;

        const id = "64eb2b804bd2c5240369e70a";
        await usermodel
          .findOneAndUpdate(
            { _id: id },
            { $set: { SHA1: biometricObject } },
            { new: true },
          )
          .then((result) => {
            return res
              .status(200)
              .send({ msg: "Biometric Added", error: "false" });
          })
          .catch((error) => {
            res
              .status(500)
              .send({ msg: "Something went wrong", error: "true" });
            console.log(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async CompareBiometricPrints(req, res) {
    const form = new formidable.IncomingForm();
    try {
      await form.parse(req, async (error, fields, files) => {
        const { biometricObject } = fields;

        const decryptedBiometricObject = cryptLib.decryptCipherTextWithRandomIV(
          biometricObject,
          process.env.app_secrete,
        );

        const id = req.token._id;
        const userdata = await usermodel.findOne({ _id: id });

        if (userdata.biometricObject === biometricObject) {
          res.status(200).send({ msg: "biometric verified", error: "false" });
        } else {
          res.status(500).send({ msg: "Something went wrong", error: "true" });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getInterestsOption(req, res) {
    //
    // await  usermodel.findOne()
    //    .then((result)=>{
    //
    //
    //        res.send({error:"false",interestsOptions:result})
    //
    //    })
    //    .catch((error)=>{
    //
    //        res.send({error:"true",interestsOptions:"null"})
    //        console.log(error)
    //    })

    // const enKey = cryptLib.encryptPlainTextWithRandomIV("interests",process.env.app_secrete)

    // const interestOptionsdata = await interestOptionsmodel.find({key:enKey})
    //  const interestarray = await interestOptionsmodel.find({}).select('interestsOptions -_id')
    // console.log(interestOptionsdata)

    //const finalArray = interestarray.substring(1, interestarray.length-1);

    var interests = [
      { interest: "Sports" },
      { interest: "Science" },
      { interest: "Programming" },
      { interest: "Cars" },
      { interest: "Plane" },
      { interest: "Politics" },
    ];

    res.status(200).send({ error: "false", interestsOptions: interests });
  }

  async addInterestsOption(req, res) {
    const form = new formidable.IncomingForm();
    try {
      await form.parse(req, async (error, fields, files) => {
        const {
          interestsOptions,
          adminName,
          adminlocationCoordinates,
          adminIP,
        } = fields;

        if (error) {
          return res
            .status(200)
            .json({ msg: "There was some error", error: "true" });
        }

        const enKey = cryptLib.encryptPlainTextWithRandomIV(
          "interests",
          process.env.app_secrete,
        );

        const interest_array = [];

        for (const interest of interestsOptions) {
          const json_object = {};

          json_object.interest = interest;
          interest_array.push(json_object);
        }

        //check if interestOption exits
        const checkifInterestExists = await interestOptionsmodel.exists({
          Added: "true",
        });
        console.log(checkifInterestExists);

        if (!checkifInterestExists) {
          const savedInterestOptions = await interestOptionsmodel
            .create({
              interestsOptions: interest_array,
              adminName,
              adminlocationCoordinates,
              adminIP: adminIP,
              key: enKey,
              Added: "true",
            })
            .then((r) => {
              //create interest Options Document
              if (r != null) {
                console.log("data saved");
                return res.status(200).json({
                  msg: "InterestsOptions Saved",
                  error: "false",
                  interestOptions: interestsOptions,
                });
              } else {
                console.log("Interest saving failure");
                return res
                  .status(200)
                  .json({ msg: "Something went wrong", error: "true" });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          //if interestOptions exits then Update interest

          const updateInterestOptions = await interestOptionsmodel
            .findOneAndUpdate(
              { Added: "true" },
              { $set: { interestsOptions: interest_array } },
              { new: true },
            )
            .then((r) => {
              if (r != null) {
                console.log("updated saved");
                return res
                  .status(200)
                  .json({ msg: "InterestsOptions Updated", error: "false" });
              } else {
                console.log("Interest update failure");
                return res
                  .status(200)
                  .json({ msg: "Something went wrong", error: "true" });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } catch (err) {
      console.log(err);
      return res
        .status(200)
        .json({ msg: "Failed to insert Interests Options", error: "true" });
    }
  }

  SigninTest(req, res) {
    const form = new formidable.IncomingForm();

    try {
      form.parse(req, async (error, fields, files) => {
        if (fields != null) {
          const { userEmail, userPassword, paYment } = fields;

          const decryptedEmail = await cryptLib.decryptCipherTextWithRandomIV(
            userEmail,
            process.env.app_secrete,
          );
          const decryptPassword = await cryptLib.decryptCipherTextWithRandomIV(
            userPassword,
            process.env.app_secrete,
          );
          const decryptPayment = await cryptLib.decryptCipherTextWithRandomIV(
            paYment,
            process.env.app_secrete,
          );

          console.log(decryptedEmail);
          const isemailvalid = decryptedEmail.includes("@");
          if (isemailvalid) {
            const findUser = await usermodel.findOne({
              userEmail: decryptedEmail,
            });
            console.log(isemailvalid);

            if (!findUser) {
              return res
                .status(200)
                .json({ msg: "User Not found", error: "true" });
            } else {
              console.log("else");

              const userPasswordfromDb = findUser.userPassword;

              var ispasswordcorrect = decryptPassword === userPasswordfromDb;
              if (!ispasswordcorrect) {
                console.log(userPassword);
                console.log(findUser.userPassword);
                return res
                  .status(200)
                  .json({ msg: "Authentication Error", error: "true" });
              } else {
                const decrypteduserPayment = findUser.userPayment;

                if (decryptPayment === decrypteduserPayment) {
                  console.log("matching payment" + findUser.userPayment);
                  await this.UpdateSiginToken(
                    findUser,
                    decryptedEmail,
                    req,
                    res,
                  );
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Authentication Error", error: "true" });
                }
              }
            }
          }
        } else {
          return res
            .status(400)
            .json({ msg: "400 Bad request", error: "true" });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: "500 Something went wrong", error: "true" });
    }
  }
}

module.exports = UserController;
