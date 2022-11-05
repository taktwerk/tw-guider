import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RequestService } from '../../utility/handler/request.service';
import { Scenarios } from '../data/constant';
import { Scenario } from '../data/interface';
import { StateService } from '../data/state.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // Optimize Code
  scenarioList: Array<Scenario> = Scenarios;
  baseScenarioSubject = new Subject();
  order_details: any;
  orderDetailList = [];
  zonesList: Array<any> = [];
  brand_list: any;

  constructor(private request: RequestService, private stateService: StateService) {

  }


  // Scenario List
  getScenarioList() {
    const user_id = this.stateService.userID;
    const success = (value: any) => {
      this.scenarioList = value.scenario_list;
    };
    this.request.send('scenario_control_get', { user_id }, success, null);
  }

  scenarioControlPut(item: any, success: any) {
    const data = {
      user_id: this.stateService.userID,
      base_scenario: item.baseScenario ?? this.stateService.baseScenario,
      scenario: item.scenario
    };
    this.request.send('scenario_control_put', data, success);
  }

  scenarioControlDelete(item: any, success: any) {
    const data = {
      user_id: this.stateService.userID,
      scenario: item.scenario ?? this.stateService.baseScenario,
    };
    this.request.send('scenario_control_delete', data, success);
  }
  // Scenario List End

  setBaseScenario(scenario: Scenario) {
    this.stateService.baseScenario = scenario;
    this.baseScenarioSubject.next(scenario);
  }

  getOrdersDetailList() {

    return new Promise(resolve => {
        const user_id = localStorage.getItem('user_id');
        const scenario = this.stateService.baseScenario;
        const data = { user_id: user_id, scenario: scenario };
        let success = (result: any) => {
          this.orderDetailList = result.order_details;
          resolve(this.orderDetailList);
        };
        this.request.send('order_details_get', data, success, null, true);
    })

  }

  getZones() {
    return new Promise(resolve => {
      if (this.zonesList.length == 0 || (this.canReload === true && this.zonesList.length > 0)) {
        const user_id = localStorage.getItem('user_id');
        const scenario = this.stateService.baseScenario;
        const success = (result: any) => {
          let options = (result.zones as Array<any>).map(item => {
            return {
              key: item,
              label: item,
              data: item
            }
          })

          this.zonesList = options;
          resolve(this.zonesList);
        };
        this.request.send('zones_get', { user_id: user_id, scenario: scenario }, success, null, false);
      } else {
        resolve(this.zonesList);
      }
    });
  }
  //

  canReload = false;

  machine_list: Array<any> = [];

  orders_list: Array<any> = [];
  orderOptions: Array<any> = [];

  grinder_list: Array<any> = [];

  packaging_lines_list: Array<any> = [];
  packagingLinesList: Array<any> = [];
  packagingLineOptions: Array<any> = [];

  brands_list: Array<any> = [];
  masterBrandList = [];
  masterCoffeeList = [];
  masterProcessList = [];
  masterZoneList = [];

  actions_list: Array<any> = [];
  sites_list: Array<any> = [];
  showHeaderDropdowns = true;

  pl_details: Array<any> = [];

  pl: any = 'N (Adjusted)';
  site: any = 'Knoxville';

  theme = {
    primaryColor: '#ce0954',
    titlebg: 'pink-title-bg.png'
  };

  // Drop down End
  get_dropdowns() {
    this.get_orders();
    this.get_machines();
    this.get_packaging_lines();
    this.get_grinder();
    this.get_brands();
    this.get_actions();
    this.getZones();
    this.get_packagingline_details();
  }

  // drop list start
  get_orders() {
    if (this.orders_list.length == 0 || (this.canReload === true && this.orders_list.length > 0)) {
      const user_id = localStorage.getItem('user_id');
      const scenario = this.stateService.baseScenario;
      this.getOrders({ user_id: user_id, scenario: scenario }, true, (result: any) => {
        this.orders_list = result.orders;
        this.orderOptions = (result.orders as Array<any>).map(item => {
          return {
            key: String(item),
            label: String(item),
            data: item
          }
        })
      });
    }
  }

  get_config() {
    const user_id = localStorage.getItem('user_id');
    this.get_curr_config({ user_id: user_id }, true, (result: any) => {

      this.site = result.config.site;
      this.pl = result.config.pl;

      localStorage.setItem('site', this.site);
      localStorage.setItem('planning_horizon', this.pl);
    });
  }


  get_machines() {
    if (this.machine_list.length == 0 || (this.canReload === true && this.machine_list.length > 0)) {
      const user_id = localStorage.getItem('user_id');
      const site = localStorage.getItem('site');
      const scenario = this.stateService.baseScenario;
      this.getMachinelist({ user_id: user_id, site: site, scenario: scenario }, true, (result: any) => {
        this.machine_list = result.machines;
      });
    }
  }

  get_packaging_lines() {
    return new Promise((resolve) => {
      // if (this.packaging_lines_list.length == 0 || (this.canReload === true && this.packaging_lines_list.length > 0)) {
        const user_id = localStorage.getItem('user_id');
        const site = localStorage.getItem('site');
        const scenario = this.stateService.baseScenario;
        this.request.send('packagingList', { user_id: user_id,site:site, scenario: scenario }, (result: any) => {
          this.packaging_lines_list = result;
          let pl: Array<any> = [];
          for (let zone of this.packaging_lines_list) {
            pl = [...pl, ...zone.Packaging_lines]
          }
          this.packagingLinesList = pl.sort(function (a, b) {
            return a.localeCompare(b); //using String.prototype.localCompare()
          });

          // const totalPackagingLines = this.packagingLinesList.forEach(function (pl) {
          //   const x = pl.packagingLinesList.
          // })

          this.packagingLineOptions = (this.packagingLinesList as Array<any>).map(item => {
            return {
              key: item,
              label: item,
              data: item
            }
          })
          resolve(this.packaging_lines_list);
        });
      // } else {
      //   resolve(this.packaging_lines_list);
      // }
    });
  }

  get_grinder() {
    if (this.grinder_list.length == 0 || (this.canReload === true && this.grinder_list.length > 0)) {
      const user_id = localStorage.getItem('user_id');
      const site = localStorage.getItem('site');
      const scenario = this.stateService.baseScenario;
      this.getGrindinglist({ user_id: user_id,  site: site, scenario: scenario }, true, (result: any) => {
        this.grinder_list = result.grinder;
      });
    }
  }

  get_brands() {
    if (this.brands_list.length == 0 || (this.canReload === true && this.brands_list.length > 0)) {
      const user_id = localStorage.getItem('user_id');
      const scenario = this.stateService.baseScenario;
      this.getBrands({ user_id: user_id, scenario: scenario }, false, (result: any) => {
        this.brands_list = result.brands;
      });
    }
  }

  get_actions() {
    if (this.actions_list.length == 0 || (this.canReload === true && this.actions_list.length > 0)) {
      const user_id = localStorage.getItem('user_id');
      const scenario = this.stateService.baseScenario;
      this.getActions({ user_id: user_id, scenario: scenario }, false, (result: any) => {
        this.actions_list = result.actions;
      });
    }
  }



  get_packagingline_details() {
    const user_id = localStorage.getItem('user_id');
    const scenario = this.stateService.baseScenario;
    this.getPackagingLineDetails({ user_id: user_id, scenario: scenario }, false, (result: any) => {
      this.pl_details = result.pl_details;
    })
  }

  get_configPackaging_data() {
    return new Promise((resolve) => {
      const user_id = localStorage.getItem('user_id');
      const site = localStorage.getItem('site');
      const zone = localStorage.getItem('zone');
      this.request.send('config_packaging_configuration_get', { user_id: user_id, site: site, zone: zone }, (result: any) => {
        resolve(result);
      });
    });
  }

  put_configPackaging_data(data) {
    return new Promise((resolve) => {
      this.request.send('config_packaging_configuration_put', data, (result: any) => {
        resolve(result);
      });
    }
    );
  }




  // dropdown ends

  getPackaginglist(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };

    this.request.send('packagingList', data, success, null, backgroundmode);
  }

  getGrindinglist(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('grindingList', data, success, null, backgroundmode);
  }

  getMachinelist(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('machineList', data, success, null, backgroundmode);
  }

  getOrders(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('orders_get', data, success, null, backgroundmode);
  }

  getBrands(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('brands_get', data, success, null, backgroundmode);
  }
  getActions(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('actions_get', data, success, null, backgroundmode);
  }

  getSites(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('sites_get', data, success, null, backgroundmode);
  }
  get_curr_config(data: any, backgroundmode = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('get_curr_config', data, success, null, backgroundmode);
  }
  getPackagingLineDetails(data: any, backgroundmode: boolean = false, response: any = null) {
    const success = (value: any) => {
      response(value);
    };
    this.request.send('packagingline_details', data, success, null, backgroundmode);
  }






}
