import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Enforcer, newEnforcer } from 'casbin';
import { UserRole } from 'src/common/types/auth.type';
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

    //! todo : create seeder to input policy and grouping policy to DB
    // await this.enforcer.addPolicy('doctor', 'clinic', '/medical', 'GET');

    // // // await this.enforcer.savePolicy();
    // await this.enforcer.addGroupingPolicy(
    //   'andre.williamyuw@gmail.com',
    //   'doctor',
    //   'clinic',
    // );
    // await this.enforcer.addGroupingPolicy(
    //   'hilal.arsa@gmail.com',
    //   'doctor',
    //   'clinic',
    // );

    // console.log('heheh');
  }

  /**
   * Get the Casbin enforcer instance for validation
   * @returns The Casbin enforcer instance.
   */
  public getEnforcerInstance(): Enforcer {
    return this.enforcer;
  }

  /**
   * Get user roles in a specific clinic
   * @param email User email
   * @param orgId Organization (clinic) ID
   */
  public getUserRolesInClinic(
    email: string,
    orgId: string,
  ): Promise<UserRole[]> {
    return this.enforcer.getRolesForUserInDomain(email, orgId) as Promise<
      UserRole[]
    >;
  }
}
