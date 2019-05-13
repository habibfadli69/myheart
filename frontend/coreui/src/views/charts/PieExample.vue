<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: ["dataPie", "labelPie", "backgroundPie"],
  mounted() {
    this.renderPieChart();
  },
  computed: {
    chartDataPie: function() {
      return this.dataPie;
    },
    labelsDataPie: function() {
      return this.labelPie;
    },
    backgroundDataPie: function() {
      return this.backgroundPie;
    }
  },
  methods: {
    renderPieChart: function() {
      this.renderChart(
        {
          // labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
          labels: this.labelsDataPie,
          datasets: [
            {
              // backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
              backgroundColor: this.backgroundDataPie,
              // data: [40, 20, 80, 10]
              data: this.chartDataPie
            }
          ]
        },
        { responsive: true, maintainAspectRatio: true }
      );
    }
  },
  watch: {
    dataPie: function() {
      // this._chart.destroy();
      // console.log(this.dataheart);
      // console.log(this.options);
      //this.renderChart(this.data, this.options);
      this.renderPieChart();
    }
  }
};
</script>
