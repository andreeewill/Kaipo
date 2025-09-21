import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import TypeORMAdaptor from 'typeorm-adapter';
import { Enforcer, newEnforcer } from 'casbin';
import _ from 'lodash';

import { UserRole } from 'src/common/types/auth.type';

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

  /**
   * Get all roles and available APIs for a user in a specific organization
   * @param email User email
   * @param organizationId Organization (clinic) ID
   * @returns Object containing user roles and available APIs
   */
  public async getAllAvailableApi(email: string, organizationId: string) {
    const userRoles = await this.getUserRolesInClinic(email, organizationId);
    const result = {};

    for (const role of userRoles) {
      // Get all policies for this role in this organization
      const policies = await this.enforcer.getFilteredPolicy(
        0,
        role,
        organizationId,
      );

      for (const policy of policies) {
        const role = policy[0];
        const urlPath = policy[2];
        const httpMethod = policy[3];

        // policy format: [role, organizationId, urlPath, method]
        const match = urlPath.match(/^\/([^\/]+)/);
        const moduleName = match ? match[1] : 'unknown';

        if (policy.length >= 4) {
          _.set(result, [role, moduleName, `${httpMethod}:${urlPath}`], true);
        }
      }
    }

    return result;
  }

  /**
   * Validates if a user has access to a specific API endpoint based.
   * @param email User ID (email)
   * @param organizationId Organization (clinic) ID
   * @param urlMethod HTTP method of the API endpoint (e.g., GET, POST)
   * @param urlPath URL path of the API endpoint (e.g., /patients, /appointments)
   * @returns boolean indicating if the user has access
   */
  public async hasAccess(
    email: string,
    organizationId: string,
    urlMethod: string,
    urlPath: string,
  ): Promise<boolean> {
    const allow = await this.enforcer.enforce(
      email,
      organizationId,
      urlPath,
      urlMethod,
    );

    return allow;
  }
}
