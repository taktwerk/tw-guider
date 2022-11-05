import { PlanningHorizon, ReportPlanningHorizon, Scenario } from "./interface";

export const Constants = {
  HAS_LOGGED_IN: 'hasLoggedIn',
  TOKEN: 'token',
  USER_ID: 'user_id',
  SITE: 'site',
  SCENARIO: 'scenario',
  PLAINNING_HORIZON: 'planning_horizon',
  REPORT_PLAINNING_HORIZON: 'report_planning_horizon',
  ROLE: 'viewer'
};

export const InputModuleOptions = {
  'app-brand-preference': {
    key: 'app-brand-preference',
    name: 'Brand Priority',
    link: '/home/add-input/brand-preference'
  },
  'app-order-splitting': {
    key: 'app-order-splitting',
    name: 'Order Splitting',
    link: 'home/add-input/order-splitting'
  },
  'app-machine-downtime': {
    key: 'app-machine-downtime',
    name: 'Machine Downtime',
    link: 'home/add-input/machine-downtime'
  },
  'app-machine-perfomance': {
    key: 'app-machine-perfomance',
    name: 'Machine Perfomance',
    link: '/home/add-input/machine-preference'
  },
  'app-order-delay': {
    key: 'app-order-delay',
    name: 'Order Delay',
    link: '/home/add-input/order-delay'
  },
  /* 'app-machine-preference': {
    key: 'app-machine-preference',
    name: 'Order Machine Preference',
    link: 'home/add-input/order-mahine-preference'
  }, */
  'app-order-movements': {
    key: 'app-order-movements',
    name: 'Order Movements',
    link: '/home/add-input/order-movements'
  },
  /* 'app-staffing': {
    key: 'app-staffing',
    name: 'Staffing Issue',
    link: '/home/add-input/staffing'
  },
  'app-waivers': {
    key: 'app-waivers',
    name: 'Waivers',
    link: '/home/add-input/waivers'
  }, */
  'app-grinding': {
    key: 'app-grinding',
    name: 'Grinder Types',
    link: '/home/add-input/grinding'
  }
};

export const sideBarMenu = [
  {
    link: '/home/scenario-summarys',
    icon: 'What-If-Scenario.svg',
    label: 'What If Scenario'
  },
  {
    link: '/home/analyze-view',
    icon: 'Scenario-Analysis.svg',
    label: 'Scenario Analysis'
  },
  //  {
  //      link: '/home/add-input',
  //      icon: 'Inputs-Modification.svg',
  //      label: 'Input Modification'
  //  },
  {
    link: '/home/custom-report/schedule-table',
    icon: 'Custom-Reports.svg',
    label: 'Custom Reports'
  },

  {
    link: '/home/admin-control/configurations',
    icon: 'Admin-Control.svg',
    label: 'Site Configuration'
  }
]

export const customReportLinks = [
  //  {
  //    link: '/home/custom-report/cp-dashboard',
  //    label: 'CP Dashboard'
  //  },
  {
    link: '/home/custom-report/raw-material-inventory',
    label: 'Raw Material'
  },
  //  {
  //    link: '',
  //    label: 'Machine OEE'
  //  },
  {
    link: '/home/custom-report/schedule-table',
    label: 'Schedule Table'
  },
  // {
  //   link: '/home/custom-report/historical-view',
  //   label: 'Historical View'
  // },
  {
    link: '/home/custom-report/incoming-order',
    label: 'Incoming Order'
  }
];

export const AdminControlLinks = [

  {
    link: '/home/admin-control/configurations',
    label: 'Configuration'
  },
  {
    link: '/home/admin-control/runtimes',
    label: 'Runtimes'
  },
  {
    link: '/home/admin-control/changeovers',
    label: 'Changeovers'
  },
  {
    link: '/home/admin-control/zone-mapping',
    label: 'Zone Mapping'
  },
  {
    link: '/home/admin-control/color-selector',
    label: 'Color Mapping'
  },

];

export const Sites = ['Knoxville', 'Windsor', 'Williston', 'Montreal', 'Sumner', 'Essex'];
export const Scenarios: Array<Scenario> = [Scenario['SAP'], Scenario['OPT']];
export const PlanningHorizons: Array<PlanningHorizon> = [PlanningHorizon["Next Sunday"], PlanningHorizon['Next 7 Days']];
export const ReportPlanningHorizons: Array<ReportPlanningHorizon> = [
  ReportPlanningHorizon["N (SAP Schedule)"],
  ReportPlanningHorizon["N+1 (SAP Schedule)"],
  ReportPlanningHorizon["N+2 (SAP Schedule)"],
  ReportPlanningHorizon["Rolling 7 days (SAP Schedule)"]
];
export const statusColor: any = {
  'Running': '92D050',
  'Completed': 'b70404',
  'Pending': 'ffff00',
  'SAP': '0000ff'
}
export const orderMovementAction = [
  'Move Order',
  'Cancel Order'
]
