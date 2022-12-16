import nodemailer from "nodemailer";

export default class EmailController {
  public transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: true,
    auth: {
      user: "ngahoeun33@gmail.com", // generated ethereal user
      pass: "vsyakohrymznwcrx", // generated ethereal password
    },
  });

  public sendPassword = (email: string, password: string, name: String) => {
    console.log("Check");
    this.transporter
      .sendMail({
        from: '"Nga Hoeun 👻" <ngahoeun33@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Sign Up Verification", // Subject line
        html: `<h1>Email Confirmation</h1>
                <h2>Hello ${name}</h2>
                <p>Thank you for signing up. This is you password: <a>${password}</a></p>
                <p>Please keep it as secret and don't let anyone see</p>
                </div>`,
      })
      .catch((err) => console.log(err));
  };
}
