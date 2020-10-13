import { EntityManager } from 'typeorm';
import { TokenLog } from '../Models/Entities';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Credential } from './Credential';
import { DateTime } from 'luxon';
import { classToPlain } from 'class-transformer';

function StringTimeToSeconds(duration: string) {
  let timeValue: number = Number(duration.substr(0, duration.length - 1));

  if (duration.includes('d')) return timeValue * 3600 * 24;
  else if (duration.includes('h')) return timeValue * 3600;
  else if (duration.includes('m')) return timeValue * 60;
  else if (duration.includes('s')) return timeValue;

  return timeValue;
}

export enum TokenType {
  //#region Identity 1-10
  AccountConfirmationToken = 1,
  PasswordResetToken = 2,
  //#endregion
}

export enum EntityType {
  Customer = 1,
}

@Injectable()
export class TokenLogger {
  private readonly tokenLogScope;

  constructor(@InjectEntityManager() private readonly EntityManager: EntityManager) {
    this.tokenLogScope = this.EntityManager.getRepository(TokenLog);
  }

  public async ClearPreviousTokens(tokenType: TokenType, identityId: number): Promise<boolean> {
    let previousTokens: TokenLog[] = await this.tokenLogScope
      .createQueryBuilder()
      .where('TokenLog.identityId = :identityId', { identityId: identityId })
      .andWhere('TokenLog.tokenType = :tokenType', { tokenType: tokenType })
      .andWhere('TokenLog.isValid = 1')
      .getMany();

    previousTokens.forEach(async (token: TokenLog) => {
      token.isValid = false;
      await this.tokenLogScope.save(token);
    });

    return true;
  }

  public async InvalidateTokenById(tokenId: number) {
    let tokenLog: TokenLog = await this.tokenLogScope.find({ id: tokenId });

    tokenLog.isValid = false;

    await this.tokenLogScope.save(tokenLog);
  }

  public async InvalidateToken(tokenLog: TokenLog) {
    tokenLog.isValid = false;
    await this.tokenLogScope.save(tokenLog);
  }

  public async GetToken(token: string): Promise<TokenLog> {
    return classToPlain(await this.tokenLogScope.findOne({ token: token })) as TokenLog;
  }

  public async AddNewTokenLog(token: string, duration: string, tokenType: TokenType, identityId: number) {
    let clearResponse = await this.ClearPreviousTokens(tokenType, identityId);

    if (clearResponse !== true) throw new Error('Token clear belaj');

    let tokenLog = new TokenLog();

    tokenLog.identityId = identityId;
    tokenLog.token = token;
    tokenLog.duration = StringTimeToSeconds(duration);
    tokenLog.isValid = true;
    tokenLog.tokenType = tokenType;
    tokenLog.expiresAt = new Date(DateTime.utc().plus({ seconds: tokenLog.duration }).toSQL());

    this.tokenLogScope.insert(tokenLog);
  }
}
