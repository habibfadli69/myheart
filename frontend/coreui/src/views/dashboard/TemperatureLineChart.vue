<script>
import { Line } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

export default {
  extends: Line,
  props: ["maindatatemperature","datatemperaturelimit","temperatureupperlimit","options","labels"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartDataTemperature: function(){
      return this.maindatatemperature;
    },
    chartDataTemperatureLimit: function(){
      return this.datatemperaturelimit;
    },
    chartDataTemperatureUpperLimit: function(){
      return this.temperatureupperlimit;
    },
    labelsData: function(){
      return this.labels;
    }
  },
  methods: {
    renderLineChart: function() {
    const brandSuccess = getStyle('--success') || '#4dbd74'
    const brandInfo = getStyle('--info') || '#20a8d8'
    const brandDanger = getStyle('--danger') || '#f86c6b'
    const brandWarning = getStyle('--warning') || '#ffc107'
    this.renderChart(
      {
        labels: this.labelsData,
        datasets: [
          
          {
            label: 'Temperature',
            backgroundColor: 'transparent',
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: this.chartDataTemperature
          },
          {
            label: 'Normal Temperature Lower Limit',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5],
            data: this.chartDataTemperatureLimit
          },
          {
            label: 'Normal Temperature Upper Limit',
            backgroundColor: 'transparent',
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5],
            data: this.chartDataTemperatureUpperLimit
          }
        ]
      },
      { 
        tooltips: {
          enabled: false,
          custom: CustomTooltips,
          intersect: true,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
            }
          }
        },
        // responsive: true, 
        maintainAspectRatio: false,
          legend: {
        display: false
      }, 
      }
    );      
    }
  },
  watch: {
    maindatatemperature: function() {
      // this._chart.destroy();
      console.log(this.dataheart);
      console.log(this.options);
      //this.renderChart(this.data, this.options);
      this.renderLineChart();
    }
  }
};
</script>
