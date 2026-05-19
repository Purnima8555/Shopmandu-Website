import crypto from "crypto";

/**
 * generat otp by normal Math.random method
 */

// const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 999999); /// Math.random() method generate random value between 0 to 1
//   // console.log(otp)
//   return otp;
// };

/**
 * by crypto randomInt() method
 */

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString(); /// it take two parameter start and end then generate value between them.
  return otp;
};


export default generateOTP;

