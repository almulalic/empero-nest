import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import * as mailerConfig from '../../mailer.config.json';
import { TokenCustomerDTO } from './../Services/Customer/DTO';

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class Mailer {
  public static SendConfirmationEmail = async (id: number, body: TokenCustomerDTO) => {
    const confirmationToken = jwt.sign({ userIdentityId: id }, process.env.EMAIL_SECRET, {
      expiresIn: '1d',
    });
    const url = process.env.APP_URL + `/accountConfirmation/${confirmationToken}`;

    sgMail
      .send({
        to: body.email,
        from: mailerConfig.noReply,
        subject: mailerConfig.confirmation.subject,
        html: `Hi ${body.firstName} ${body.lastName}! Please click this link to confirm your email <a href="${url}">${url}</a> <input value=${confirmationToken} />`,
      })
      .catch((err) => {
        throw new Error(mailerConfig.confirmation.fail);
      });
  };

  public ResendConfirmationEmail = async (customerData) => {
    const confirmationToken = jwt.sign({ id: customerData.id }, process.env.EMAIL_SECRET, {
      expiresIn: '1d',
    });
    const url = process.env.APP_URL + `/accountConfirmation/${confirmationToken}`;

    sgMail
      .send({
        to: customerData.email,
        from: mailerConfig.noReply,
        subject: mailerConfig.confirmation.subject,
        html: `Hi there! You requested reconfirmation. Please click this link to confirm your email <a href="${url}">${url}</a>`,
      })
      .then(() => {
        return mailerConfig.confirmation.success;
      })
      .catch((err) => {
        return mailerConfig.confirmation.fail;
      });
  };

  public SendResetPasswordEmail = async (userData) => {
    const confirmationToken = jwt.sign({ userIdentityId: userData.id }, process.env.PASSWORD_RESET_SECRET, {
      expiresIn: '12h',
    });
    const url = process.env.APP_URL + `/identity/resetPasswordConfirmation/${confirmationToken}`;

    sgMail
      .send({
        to: userData.email,
        from: 'no-reply@enviorment.live',
        subject: 'Reset password golden spoon',
        html: ` Please click this link to proceed to password reset <a href="${url}">${url}</a> <input value=${confirmationToken} />`,
      })
      .then(() => {
        return 'EmailSentSuccessfully';
      })
      .catch((err) => {
        console.log(err);
        return 'EmailNotSent';
      });
  };

  public SendGenericEmail = async (body) => {
    sgMail
      .send({
        from: body.from,
        to: body.to,
        subject: body.subject,
        html: body.html,
      })
      .then(() => {
        return 'EmailSentSuccessfully';
      })
      .catch((err) => {
        console.log(err);
        return 'EmailNotSent';
      });
  };
}
