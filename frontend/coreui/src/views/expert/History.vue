<template>
  <div>
    <div class="animated fadeIn">
      <b-row>
        <b-col md="6">
          <b-card header="Choose cow for know their historic" class="card-accent-warning">
            <bounce-spinner v-if="isLoading"></bounce-spinner>
            <b-table
              v-if="isLoading==false"
              class="mb-0 table-outline"
              striped
              responsive="sm"
              hover
              :items="tableItemsSapi"
              :fields="tableFieldsSapi"
              head-variant="light"
              :current-page="currentPage"
              :per-page="perPage"
            >
              <div slot="key-nama-sapi" slot-scope="data">
                <img src="img/cow/cow (2).png" width="50px" alt="cows logo">
                <strong>{{data.item.namaSapi}}</strong>
              </div>
              <div slot="key-action-sapi" slot-scope="data">
                <b-button variant="primary" size="sm" @click="toDetail(data.item._id)">Choose</b-button>
              </div>
            </b-table>
            <hr>
            <nav>
              <b-pagination
                :total-rows="getRowCount(tableItems)"
                :per-page="perPage"
                v-model="currentPage"
                prev-text="Prev"
                next-text="Next"
                hide-goto-end-buttons
              />
            </nav>
          </b-card>
        </b-col>
        <b-col md="6">
          <b-card header="Our cows diseases" class="card-accent-warning">
            <bounce-spinner v-if="isLoadingPie"></bounce-spinner>
            <div class="chart-wrapper">
              <pie-example
                v-if="isLoadingPie==false"
                chartId="chart-pie-01"
                :dataPie="dataPie"
                :labelPie="labelPie"
                :backgroundPie="backgroundPie"
              />
            </div>
            <!-- <bounce-spinner v-if="isLoadingAttr"></bounce-spinner>
          <b-table
            v-if="isLoadingAttr==false"
            class="mb-0 table-outline"
            striped
            responsive="sm"
            hover
            :items="tableItemsAttr"
            :fields="tableFieldsAttr"
            head-variant="light"
            :current-page="currentPageAttr"
            :per-page="perPageAttr"
          >
            <div slot="key-nama-attr" slot-scope="data">
              <i class="icon-ghost"></i>
              <strong> {{data.item.namaAttribute}}</strong>
            </div>
            <div slot="key-identity-attr" slot-scope="data">
              <i class="icon-key"></i>
              <strong> {{data.item.attributeIdentitiy}}</strong>
            </div>
            
          </b-table>
          <hr>
          <nav>
            <b-pagination :total-rows="getRowCount(tableItemsAttr)" :per-page="perPageAttr" v-model="currentPageAttr" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>-->
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import CardLine1ChartExample from "../dashboard/CardLine1ChartExample";
import CardLine2ChartExample from "../dashboard/CardLine2ChartExample";
import CardLine3ChartExample from "../dashboard/CardLine3ChartExample";
import CardBarChartExample from "../dashboard/CardBarChartExample";
import MainChartExample from "../dashboard/MainChartExample";
import SocialBoxChartExample from "../dashboard/SocialBoxChartExample";
import CalloutChartExample from "../dashboard/CalloutChartExample";
import { Callout } from "@coreui/vue";
import PostsService from "@/services/PostsService";
import Constants from "@/services/Constants";
import "vue-spinners/dist/vue-spinners.css";
import { BounceSpinner } from "vue-spinners/dist/vue-spinners.common";
import PieExample from "../charts/PieExample";

export default {
  name: "History",
  components: {
    Callout,
    BounceSpinner,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample,
    PieExample
  },
  data: function() {
    return {
      //====alert=====
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      //====alert=====
      //  ===== pie chart ===
      backgroundPie: ["#41B883", "#f4aa42", "#00D8FF", "#DD1B16"],
      labelPie: [],
      dataPie: [],
      // ==== pie chart ===
      // ===loading state===
      isLoading: true,
      isLoadingPie: true,
      // ===loading state===
      file: "",
      currentPage: 1,
      currentPageAttr: 1,
      perPage: 5,
      perPageAttr: 5,
      totalRows: 0,
      totalRowsAttr: 0,
      tableItems: [],
      successAlert: [],
      tableFields: [
        {
          key: "key-nama",
          label: "Name of label"
        },
        {
          key: "key-identity",
          label: "Identity of label"
        }
      ],
      tableItemsAttr: [],
      tableFieldsAttr: [
        {
          key: "key-nama-attr",
          label: "Name of attribute"
        },
        {
          key: "key-identity-attr",
          label: "Identity of attribute"
        }
      ],
      tableItemsSapi: [],
      tableFieldsSapi: [
        {
          key: "key-nama-sapi",
          label: "Cow name"
        },
        {
          key: "key-action-sapi",
          label: "Choose"
        }
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async submitFile() {
      let formData = new FormData();
      formData.append("file", this.file);
      let response = await PostsService.uploadDataTraining(formData);
      this.successAlert = [];
      if (response.data.status) {
        this.successAlert.push(response.data.message);
        this.showAlert();
        this.isLoading = true;
        this.firstLoad();
        // setTimeout("location.reload(true);",2000);
      }
    },
    async fetchDataSapi() {
      const response = await PostsService.getSapi(
        window.localStorage.getItem("token")
      );
      return response.data;
    },
    async fetchAllDataDiagnose() {
      const response = await PostsService.getAllDiagnoses();
      return response.data;
    },
    async fetchDataLabel() {
      let response = await PostsService.getAllLabel();
      return response.data;
    },
    async fetchDataAttributes() {
      let response = await PostsService.getAllAttributes();
      return response.data;
    },
    getRowCount(items) {
      return items.length;
    },
    checkSession() {
      /**
       * check session and do action
       */
      if (!window.localStorage.getItem("token")) {
        this.$router.push({ name: "Login" });
      } else {
        if (window.localStorage.getItem("role") != Constants.ROLE_FARMERS) {
          // redirect to 404 page
          this.$router.push({ name: "Page404" });
        } else {
          this.firstLoad();
        }
      }
    },
    async firstLoad() {
      const response = await this.fetchDataSapi();
      let responseData = await this.fetchDataLabel();
      let responseDataAttr = await this.fetchDataAttributes();
      const responseDataDiagnoses = await this.fetchAllDataDiagnose();
      for(var i=0;i<responseDataDiagnoses.data.length;i++){
        this.dataPie.push(responseDataDiagnoses.data[i].total)
        this.labelPie.push(responseDataDiagnoses.data[i].diagnose)
      }
      this.isLoadingPie = false;
      let sapiData = response.data;
      this.tableItemsSapi = sapiData;
      let labelData = responseData.data;
      this.tableItems = labelData;
      this.isLoading = false;
      let attrData = responseDataAttr.data;
      this.tableItemsAttr = attrData;
      
    }
  }
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}
</style>
