<script>
import { Line } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

export default {
  extends: Line,
  props: ["dataheart","dataheartlimit","heartupperlimit","options","labels"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartDataHeart: function() {
      return this.dataheart;
    },
    chartDataHeartLimit: function(){
      return this.dataheartlimit;
    },
    chartDataHeartUpperLimit: function(){
      return this.heartupperlimit;
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
            label: "Heart Rate",
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: this.chartDataHeart
          },
          {
            label: 'Normal Heart Rate Lower Limit',
            backgroundColor: hexToRgba(brandDanger, 10),
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5],
            data: this.chartDataHeartLimit
          },
          {
            label: 'Normal Heart Rate Upper Limit',
            backgroundColor:'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5],
            data: this.chartDataHeartUpperLimit
          },
          
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
        responsive: true, 
        maintainAspectRatio: false 
      }
    );      
    }
  },
  watch: {
    dataheart: function() {
      // this._chart.destroy();
      console.log(this.dataheart);
      console.log(this.options);
      //this.renderChart(this.data, this.options);
      this.renderLineChart();
    }
  }
};
</script>
