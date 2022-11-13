import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexAnnotations, ApexFill, ApexStroke, ApexGrid } from "ng-apexcharts";
import { Subject } from "rxjs";

export class Timeline {
    chartData: Array<any> = [];
    checkLegend: Array<any> = [];
    groups: Array<any> = [];
    time_ranges: Array<any> = [];
    reload: Subject<any> = new Subject();
}

export interface ChartOptions {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    dataLabels?: ApexDataLabels;
    plotOptions?: ApexPlotOptions;
    yaxis?: ApexYAxis;
    xaxis?: any; //ApexXAxis;
    annotations?: ApexAnnotations;
    fill?: ApexFill;
    title?: any;
    stroke?: ApexStroke;
    grid?: ApexGrid;
};


export enum Scenario { 'SAP' = 'SAP', 'OPT' = 'OPT' };
export enum PlanningHorizon { 'Next Sunday' = 'Next Sunday', 'Next 7 Days' = 'Next 7 Days' };
export enum ReportPlanningHorizon {
    'N (SAP Schedule)' = 'N (SAP Schedule)',
    'N+1 (SAP Schedule)' = 'N+1 (SAP Schedule)',
    'N+2 (SAP Schedule)' = 'N+2 (SAP Schedule)',
    'Rolling 7 days (SAP Schedule)' = 'Rolling 7 days (SAP Schedule)'
};