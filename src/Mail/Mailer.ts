import * as jwt from 'jsonwebtoken';
import * as sgMail from '@sendgrid/mail';
import * as mailerConfig from '../../mailer.config.json';
import { TokenCustomerDTO } from './../Services/Customer/DTO';
import { Credential } from '../Common/Credential';

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class Mailer {
  public static SendConfirmationEmail = async (id: number, body: TokenCustomerDTO): Promise<string> => {
    const url =
      process.env.BASE_AUTH_URL + `/accountConfirmation/${await Credential.GenerateConfirmationToken(id, '1d')}`;

    return new Promise((resolve, reject) => {
      sgMail
        .send({
          to: body.email,
          from: mailerConfig.noReply,
          subject: mailerConfig.confirmation.subject,
          html: `Hi ${body.firstName} ${body.lastName}! Please click this link to confirm your email <a href="${url}">${url}</a>`,
        })
        .then(() => {
          resolve(mailerConfig.confirmation.success);
        })
        .catch((err) => {
          resolve(mailerConfig.confirmation.fail);
        });
    });
  };

  public static ResendConfirmationEmail = async (customerData): Promise<string> => {
    const url =
      process.env.BASE_AUTH_URL +
      `/accountConfirmation/${await Credential.GenerateConfirmationToken(customerData.id, '1d')}`;

    return new Promise((resolve, reject) => {
      sgMail
        .send({
          to: customerData.email,
          from: mailerConfig.noReply,
          subject: mailerConfig.confirmation.subject,
          html: `Hi ${customerData.firstName} ${customerData.lastName}! You requested a new email confirmation mail. Please click this link to confirm your email <a href="${url}">${url}</a> `,
        })
        .then(() => {
          resolve(mailerConfig.confirmation.success);
        })
        .catch(() => {
          resolve(mailerConfig.confirmation.fail);
        });
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
