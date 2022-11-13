import { Injectable } from '@angular/core';
import { Constants } from './constant';
import { StoreService } from '../../database/store.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  default = {
    baseScenario: 'SAP',
    site: 'Knoxville',
    planningHorizon: 'N (adjusted)',
    reportPlanningHorizon: 'N (SAP Schedule)',
    token: null,
    hasLoggedIn: false,
    user_id: null,
    role: 'viewer'
  }

  get role() {
    return StoreService.get(Constants.ROLE) ?? this.default.role
  }

  set role(val) {
    StoreService.set(Constants.ROLE, val);
  }

  get userID() {
    return StoreService.get(Constants.USER_ID) ?? this.default.user_id
  }

  set userID(val) {
    StoreService.set(Constants.USER_ID, val);
  }

  get hasLoggedIn() {
    return StoreService.get(Constants.HAS_LOGGED_IN) ?? this.default.hasLoggedIn
  }

  set hasLoggedIn(val) {
    StoreService.set(Constants.HAS_LOGGED_IN, val);
  }

  get token() {
    return StoreService.get(Constants.TOKEN) ?? this.default.token
  }

  set token(val) {
    StoreService.set(Constants.TOKEN, val);
  }



  get baseScenario() {
    return StoreService.get(Constants.SCENARIO) ?? this.default.baseScenario
  }

  set baseScenario(val) {
    StoreService.set(Constants.SCENARIO, val);
  }

  get site() {
    return StoreService.get(Constants.SITE) ?? this.default.site
  }

  set site(val) {
    StoreService.set(Constants.SITE, val);
  }

  get planningHorizon() {
    return StoreService.get(Constants.PLAINNING_HORIZON) ?? this.default.planningHorizon
  }

  set planningHorizon(val) {
    StoreService.set(Constants.PLAINNING_HORIZON, val);
  }

  get reportPlanningHorizon() {
    return StoreService.get(Constants.REPORT_PLAINNING_HORIZON) ?? this.default.reportPlanningHorizon
  }

  set reportPlanningHorizon(val) {
    StoreService.set(Constants.REPORT_PLAINNING_HORIZON, val);
  }

}
