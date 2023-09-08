
const mailConfig = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, //587/465
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: '56c8bac8493adb', //vivek.kumar@rxcs.in
        pass: '9819159026e862' //rvbrqgujgfbyzeyh / Vivek@2023
    }
};
export default mailConfig
//module.exports = mailConfig;