import { environment } from '../../../environments/environment';

const api: any = {
  endpoints: {

    // Auth

    login: {
      requestType: 'post',
      url: '/login',
      headers: { 'Access-Control-Allow-Credentials': true },
      parameters: [
        {
          email: '',
          password: ''
        }
      ]
    },

    // Configration

    // Scenario
    scenario_control_get: {
      requestType: 'get',
      url: '/scenario_control?user_id={{user_id}}'
    },

    scenario_control_put: {
      requestType: 'put',
      url: '/scenario_control?user_id={{user_id}}&scenario={{scenario}}&base_scenario={{base_scenario}}'
    },
    scenario_control_delete: {
      requestType: 'delete',
      url: '/scenario_control?user_id={{user_id}}&scenario={{scenario}}'
    },


    summary: {
      requestType: 'get',
      url: ''
    },
    summaryRec: {
      requestType: 'get',
      url: '/analyze_summary?user_id={{user_id}}&scenario={{scenario}}'
    },

    charts_summary: {
      requestType: 'get',
      url: '/analyze_summary_chart?user_id={{user_id}}&scenario={{scenario}}&zone={{zone}}'
    },

    grindingList: {
      requestType: 'get',
      url: '/analyze_grinder_dropdown?user_id={{user_id}}&site={{site}}'
    },

    analyzeGrinderData: {
      requestType: 'post',
      url: '/analyze_grinder_data?user_id={{user_id}}&scenario={{scenario}}'
    },

    machineList: {
      requestType: 'get',
      url: '/machine_dropdown?user_id={{user_id}}&site={{site}}'
    },

    sites_get: {
      requestType: 'get',
      url: '/sites?user_id={{user_id}}'
    },

    zones_get: {
      requestType: 'get',
      url: '/zones?user_id={{user_id}}'
    },

    order_details_get: {
      requestType: 'get',
      url: '/order_details?user_id={{user_id}}&scenario={{scenario}}'
    },

    brands_get: {
      requestType: 'get',
      url: '/brands?user_id={{user_id}}&scenario={{scenario}}'
    },

    // Admin Screen

    admin_zones_get: {
      requestType: 'get',
      url: '/analyze_packaging_line_dropdown?user_id={{user_id}}&site={{site}}'
    },

    admin_gr_brands_get: {
      requestType: 'get',
      url: '/admin_grinder_brand_dropdown?user_id={{user_id}}&site={{site}}'
    },

    admin_gr_coffee_get: {
      requestType: 'get',
      url: '/admin_grinder_coffee_type_dropdown?user_id={{user_id}}&site={{site}}'
    },

    admin_gr_process_get: {
      requestType: 'get',
      url: '/admin_grinder_process_dropdown?user_id={{user_id}}&site={{site}}'
    },

    admin_pl_brands_get: {
      requestType: 'get',
      url: '/brands?user_id={{user_id}}&site={{site}}'
    },

    admin_pl_filter_type_get: {
      requestType: 'get',
      url: '/admin_packaging_filter_dropdown?user_id={{user_id}}&site={{site}}'
    },

    admin_pl_case_count_get: {
      requestType: 'get',
      url: '/?user_id={{user_id}}&site={{site}}'
    },

    admin_pl_case_count_dropdown_get: {
      requestType: 'get',
      url: '/admin_packaging_case_count_dropdown?user_id={{user_id}}&site={{site}}'
    },

    // grinder runtime
    admin_gr_runtimes_get: {
      requestType: 'get',
      url: '/admin_grinding_runtimes?user_id={{user_id}}&site={{site}}'
    },

    admin_gr_runtimes_put: {
      requestType: 'put',
      url: '/admin_grinding_runtimes?user_id={{user_id}}&site={{site}}'
    },

    // packaging runtime
    admin_pl_runtimes_post: {
      requestType: 'post',
      url: '/admin_packaging_runtimes?user_id={{user_id}}&site={{site}}'
    },
    admin_pl_runtimes_put: {
      requestType: 'put',
      url: '/admin_packaging_runtimes?user_id={{user_id}}&site={{site}}'
    },

    // Grinding Changeovers
    admin_gr_changeovers_get: {
      requestType: 'get',
      url: '/admin_grinding_changeovers?user_id={{user_id}}&site={{site}}'
    },

    admin_gr_changeovers_put: {
      requestType: 'put',
      url: '/admin_grinding_changeovers?user_id={{user_id}}&site={{site}}'
    },

    // Packaging Changeovers
    admin_pl_changeovers_get: {
      requestType: 'get',
      url: '/admin_packaging_changeovers?user_id={{user_id}}&site={{site}}'
    },

    admin_pl_changeovers_put: {
      requestType: 'put',
      url: '/admin_packaging_changeovers?user_id={{user_id}}&site={{site}}'
    },

    actions_get: {
      requestType: 'get',
      url: '/actions?user_id={{user_id}}&scenario={{scenario}}'
    },
    orders_get: {
      requestType: 'get',
      url: '/orders?user_id={{user_id}}&scenario={{scenario}}'
    },

    analyze_grinder_summary: {
      requestType: 'post',
      url: '/analyze_grinder?user_id={{user_id}}&scenario={{scenario}}&grinder_name={{grinder_name}}'
    },

    analyze_grinding_table: {
      requestType: 'post',
      url: '/analyze_grinding_table?user_id={{user_id}}&scenario={{scenario}}&grinder_name={{grinder_name}}'
    },
    analyze_grinding_chart: {
      requestType: 'post',
      url: '/analyze_grinding_chart?user_id={{user_id}}&scenario={{scenario}}&grinder_name={{grinder_name}}'
    },

    packagingList: {
      requestType: 'get',
      url: '/analyze_packaging_line_dropdown?user_id={{user_id}}&site={{site}}'
    },

    analyzePackagingData: {
      requestType: 'post',
      url: '/analyze_packaging_data?user_id={{user_id}}&scenario={{scenario}}'
    },

    analyze_packaging_summary: {
      requestType: 'post',
      url: '/analyze_packaging_line?user_id={{user_id}}&scenario={{scenario}}'
    },

    analyze_packaging_table: {
      requestType: 'post',
      url: '/analyze_packaging_table?user_id={{user_id}}&scenario={{scenario}}'
    },

    analyze_packaging_chart: {
      requestType: 'post',
      url: '/analyze_packaging_chart?user_id={{user_id}}&scenario={{scenario}}'
    },

    analyze_packaging_schedule: {
      requestType: 'post',
      url: '/analyze_packaging_schedule?user_id={{user_id}}&scenario={{scenario}}'
    },

    machine_downtime_get: {
      requestType: 'get',
      url: '/input_to_machine_downtime?user_id={{user_id}}&scenario={{scenario}}'
    },

    machine_downtime_put: {
      requestType: 'put',
      url: '/input_to_machine_downtime?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    machine_downtime_delete: {
      requestType: 'delete',
      url: '/input_to_machine_downtime?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    staffing_get: {
      requestType: 'get',
      url: '/input_to_staffing_issues?user_id={{user_id}}&scenario={{scenario}}'
    },

    staffing_put: {
      requestType: 'put',
      url: '/input_to_staffing_issues?user_id={{user_id}}&scenario={{scenario}}'
    },

    staffing_delete: {
      requestType: 'delete',
      url: '/input_to_staffing_issues?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    order_preference_get: {
      requestType: 'get',
      url: '/input_to_order_preference?user_id={{user_id}}&scenario={{scenario}}'
    },

    order_preference_put: {
      requestType: 'put',
      url: '/input_to_order_preference?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    order_preference_delete: {
      requestType: 'delete',
      url: '/input_to_order_preference?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    brand_preference_get: {
      requestType: 'get',
      url: '/input_to_brand_preference?user_id={{user_id}}&scenario={{scenario}}'
    },

    brand_preference_put: {
      requestType: 'put',
      url: '/input_to_brand_preference?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    brand_preference_delete: {
      requestType: 'delete',
      url: '/input_to_brand_preference?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true },
    },
    order_splitting_get: {
      requestType: 'get',
      url: '/input_to_order_splitting?user_id={{user_id}}&scenario={{scenario}}'
    },

    order_splitting_put: {
      requestType: 'put',
      url: '/input_to_order_splitting?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    order_splitting_delete: {
      requestType: 'delete',
      url: '/input_to_order_splitting?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },


    order_movement_get: {
      requestType: 'get',
      url: '/input_to_order_movements?user_id={{user_id}}&scenario={{scenario}}'
    },

    order_movement_put: {
      requestType: 'put',
      url: '/input_to_order_movements?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    order_movement_delete: {
      requestType: 'delete',
      url: '/input_to_order_movements?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    waivers_get: {
      requestType: 'get',
      url: '/input_to_waivers?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    waivers_put: {
      requestType: 'put',
      url: '/input_to_waivers?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    waivers_delete: {
      requestType: 'delete',
      url: '/input_to_waivers?user_id={{user_id}}&scenario={{scenario}}&id={{id}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    order_delay_get: {
      requestType: 'get',
      url: '/input_to_order_delay?user_id={{user_id}}&scenario={{scenario}}'
    },

    order_delay_put: {
      requestType: 'put',
      url: '/input_to_order_delay?user_id={{user_id}}&scenario={{scenario}}',
      headers: { 'Access-Control-Allow-Credentials': true }
    },

    order_delay_delete: {
      requestType: 'delete',
      url: '/input_to_order_delay?user_id={{user_id}}&scenario={{scenario}}&id={{id}}'
    },

    machine_performance_get: {
      requestType: 'get',
      url: '/input_to_machine_performance?user_id={{user_id}}&scenario={{scenario}}'
    },

    machine_performance_put: {
      requestType: 'put',
      url: '/input_to_machine_performance?user_id={{user_id}}&scenario={{scenario}}'
    },

    machine_performance_delete: {
      requestType: 'delete',
      url: '/input_to_machine_performance?user_id={{user_id}}&scenario={{scenario}}&id={{id}}'
    },

    scenario_summary_get: {
      requestType: 'get',
      url: '/scenario_summary?user_id={{user_id}}'
    },


    auto_update_control_get: {
      requestType: 'get',
      url: '/auto_update_control?user_id={{user_id}}'
    },

    auto_update_control_put: {
      requestType: 'put',
      url: '/auto_update_control?user_id={{user_id}}'
    },
    run_optimizer: {
      requestType: 'get',
      url: '/run_optimizer?user_id={{user_id}}&scenario={{scenario}}'
    },
    run_simulator: {
      requestType: 'get',
      url: '/run_simulator?user_id={{user_id}}&scenario={{scenario}}'
    },
    refresh_data: {
      requestType: 'get',
      url: '/refresh_data?user_id={{user_id}}'
    },
    refresh_site_data: {
      requestType: 'get',
      url: '/refresh_site_data?user_id={{user_id}}&site={{site}}&planning_horizon={{planning_horizon}}'
    },
    grinder_types_get: {
      requestType: 'get',
      url: '/input_to_grinder_types?user_id={{user_id}}&scenario={{scenario}}'
    },
    grinder_types_put: {
      requestType: 'put',
      url: '/input_to_grinder_types?user_id={{user_id}}&scenario={{scenario}}'
    },

    reportSchedule: {
      requestType: 'get',
      url: '/scheduling_summary_table?user_id={{user_id}}&scenario={{scenario}}&cut_off_type={{cut_off_type}}'
    },

    materialIds: {
      requestType: 'get',
      url: '/material?user_id={{user_id}}'
    },

    materialIdSingle: {
      requestType: 'get',
      url: '/raw_material_data?user_id={{user_id}}&material_id={{material_id}}'
    },

    materialSummary: {
      url: '/raw_material_order_popup?user_id={{user_id}}&order_number={{order_number}}&order_type={{order_type}}',
      requestType: 'get'
    },

    deepDiveConsumptionPopup: {
      url: '/order_packaging_popup_cards?user_id={{user_id}}&order_number={{order_number}}&order_type={{order_type}}',
      requestType: 'get'
    },

    downloadSchedule: {
      requestType: 'get',
      url: '/download_excel?user_id={{user_id}}&cut_off_type={{cut_off_type}}'
    },

    raw_material_cards: {
      requestType: 'get',
      url: '/raw_material_cards?user_id={{user_id}}'
    },

    order_material_toggle: {
      requestType: 'get',
      url: '/order_material_toggle?user_id={{user_id}}'
    },

    raw_material_summary: {
      requestType: 'get',
      url: '/raw_material_summary?user_id={{user_id}}&toggle={{toggle}}&variable_id={{variable_id}}&cut_off_type={{cut_off_type}}'
    },

    update_custom_reports: {
      requestType: 'get',
      url: '/update_custom_reports?user_id={{user_id}}&cut_off_type={{cut_off_type}}'
    },

    get_curr_config: {
      requestType: 'get',
      url: '/get_curr_config?user_id={{user_id}}'
    },

    packagingline_details: {
      requestType: 'get',
      url: '/packagingline_details?user_id={{user_id}}&scenario={{scenario}}'
    },

    // historail view
    getDateOptions: {
      requestType: 'get',
      url: '/date_lookup_dropdown?user_id={{user_id}}'
    },

    historicalScenarioSummary: {
      requestType: 'post',
      url: '/historical_scenario_summary?user_id={{user_id}}&lookup_date={{lookup_date}}'
    },

    incomingOrder: {
      requestType: 'get',
      url: '/upcoming_order?user_id={{user_id}}&site={{site}}'
    },
    baselineScheduling: {
      requestType: 'get',
      url: '/upcoming_orders_split?user_id={{user_id}}&site={{site}}'
    },

    baselineRefresh: {
      requestType: 'get',
      url: '/base_line_refresh?user_id={{user_id}}&site={{site}}'
    },

    admin_grinding_configuration_get: {
      requestType: 'get',
      url: '/admin_grinding_configuration?user_id={{user_id}}&site={{site}}'
    },

    admin_grinding_configuration_put: {
      requestType: 'put',
      url: '/admin_grinding_configuration?user_id={{user_id}}&site={{site}}'
    },
    admin_packagingData_post: {
      requestType: 'post',
      url: '/admin_packaging_configuration?user_id={{user_id}}&site={{site}}'
    },
    admin_packagingData_put: {
      requestType: 'put',
      url: '/admin_packaging_configuration?user_id={{user_id}}&site={{site}}'
    },
    admin_zones_put: {
      requestType: 'put',
      url: '/admin_zone_packaging_update?user_id={{user_id}}&site={{site}}'
    },

    admin_color_mapping_get : {
      requestType: 'get',
      url: '/admin_color_mapping?user_id={{user_id}}&site={{site}}'
    },
    admin_color_mapping_put : {
      requestType: 'put',
      url: '/admin_color_mapping?user_id={{user_id}}&site={{site}}'
    }
  },
  defaultDomain: () => environment?.baseUrl
};
export default api;
