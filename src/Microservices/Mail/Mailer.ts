import * as sgMail from '@sendgrid/mail';
import * as mailerConfig from '../../../mailer.config.json';
import { Customer } from '../../Models/Entities/Customer';

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class Mailer {
  public static SendConfirmationEmail = async (identity: Customer, token: string): Promise<string> => {
    const url = process.env.BASE_APP_URL + `/accountConfirmation/${token}`;

    return new Promise((resolve, reject) => {
      sgMail
        .send({
          to: identity.email,
          from: mailerConfig.noReply,
          subject: mailerConfig.confirmation.subject,
          html: `Hi ${identity.firstName} ${identity.lastName}! Please click this link to confirm your email <a href="${url}">${url}</a>`,
        })
        .then(() => {
          resolve(mailerConfig.confirmation.success);
        })
        .catch((err) => {
          resolve(mailerConfig.confirmation.fail);
        });
    });
  };

  public static ResendConfirmationEmail = async (identity: Customer, token: string): Promise<string> => {
    const url = process.env.BASE_APP_URL + `/identity/accountConfirmation/${token}`;

    return new Promise((resolve, reject) => {
      sgMail
        .send({
          to: identity.email,
          from: mailerConfig.noReply,
          subject: mailerConfig.confirmation.subject,
          html: `Hi ${identity.firstName} ${identity.lastName}! You requested a new email confirmation mail. Please click this link to confirm your email <a href="${url}">${url}</a> `,
        })
        .then(() => {
          resolve(mailerConfig.confirmation.success);
        })
        .catch(() => {
          resolve(mailerConfig.confirmation.fail);
        });
    });
  };

  public static SendResetPasswordEmail = async (identity: Customer, token: string) => {
    const url = process.env.BASE_APP_URL + `/identity/resetPasswordConfirmation/${token}`;

    return new Promise((resolve, reject) => {
      sgMail
        .send({
          to: identity.email,
          from: mailerConfig.noReply,
          subject: 'Reset password golden spoon',
          html: ` Please click this link to proceed to password reset <a href="${url}">${url}</a>`,
        })
        .then(() => {
          resolve(mailerConfig.confirmation.success);
        })
        .catch(() => {
          resolve(mailerConfig.confirmation.fail);
        });
    });
  };

  public static SendGenericEmail = async (body) => {
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
