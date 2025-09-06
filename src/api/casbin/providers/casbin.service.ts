import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Enforcer, newEnforcer } from 'casbin';
import { DataSource } from 'typeorm';
import TypeORMAdaptor from 'typeorm-adapter';

@Injectable()
export class CasbinService implements OnModuleInit {
  private enforcer: Enforcer;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const adapter = await TypeORMAdaptor.newAdapter({
      connection: this.dataSource,
    });

    this.enforcer = await newEnforcer('./keystore/kaipo-rbac.conf', adapter);
    this.enforcer.enableAutoSave(true);

    // await this.enforcer.addPolicy('doctor', 'clinic2', '/medical', 'GET');

    // // await this.enforcer.savePolicy();
    // console.log('heheh');
  }

  /**
   * Get the Casbin enforcer instance for validation
   * @returns The Casbin enforcer instance.
   */
  public getEnforcer(): Enforcer {
    return this.enforcer;
  }
}
