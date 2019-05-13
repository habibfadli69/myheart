<template>
<div>
  <div class="animated fadeIn">
        <b-alert :show="dismissCountDown"
                       dismissible
                       variant="success"
                       @dismissed="dismissCountdown=0"
                       @dismiss-count-down="countDownChanged">
                <strong>Congratulation</strong>
                <ul>
                    <li v-for="item in successAlert" :key="item">{{ item }}</li>
                </ul>
                Notification will dismiss after <strong>{{dismissCountDown}}</strong> seconds...
                <b-progress variant="info"
                            :max="dismissSecs"
                            :value="dismissCountDown"
                            height="4px">
                </b-progress>
        </b-alert>
      <b-row>
         
          <b-col md="12">
            <b-card header="Upload data training (format: .csv)" class="card-accent-warning" style="text-align:center">
        <!-- <div class="large-12 medium-12 small-12 cell"> -->
            <label>Data training
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
            <b-button v-on:click="submitFile()" type="submit" size="sm" variant="primary"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            
          </b-card>
          </b-col>
      </b-row>
    <b-row>
      <b-col md="6">
        <b-card header="Labels List" class="card-accent-warning">
          <bounce-spinner v-if="isLoading"></bounce-spinner>
          <b-table
            v-if="isLoading==false"
            class="mb-0 table-outline"
            striped
            responsive="sm"
            hover
            :items="tableItems"
            :fields="tableFields"
            head-variant="light"
            :current-page="currentPage"
            :per-page="perPage"
          >
            <div slot="key-nama" slot-scope="data">
              <i class="icon-ghost"></i>
              <strong> {{data.item.namaLabel}}</strong>
            </div>
            <div slot="key-identity" slot-scope="data">
              <i class="icon-key"></i>
              <strong> {{data.item.labelIdentity}}</strong>
            </div>
            
          </b-table>
          <hr>
          <nav>
            <b-pagination :total-rows="getRowCount(tableItems)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
          </nav>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card header="Attributes List" class="card-accent-warning">
          <bounce-spinner v-if="isLoadingAttr"></bounce-spinner>
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
          </nav>
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
import 'vue-spinners/dist/vue-spinners.css'
import { BounceSpinner } from 'vue-spinners/dist/vue-spinners.common';

export default {
  name: "Training",
  components: {
    Callout,
    BounceSpinner,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  data: function() {
    return {
     //====alert=====
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
     //====alert=====
      file:'',
      currentPage: 1,
      currentPageAttr:1,
      perPage: 5,
      perPageAttr:5,
      totalRows: 0,
      totalRowsAttr: 0,
      isLoading: true,
      isLoadingAttr: true,
      tableItems: [],
      successAlert: [],
      tableFields: [
        {
          key:'key-nama',
          label: 'Name of label'
        },
        {
          key:'key-identity',
          label: 'Identity of label'
        }
      ],
      tableItemsAttr:[],
      tableFieldsAttr:[
        {
          key:'key-nama-attr',
          label: 'Name of attribute'
        },
        {
          key:'key-identity-attr',
          label: 'Identity of attribute'
        }
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    handleFileUpload(){
        this.file = this.$refs.file.files[0];
    },
    async submitFile(){
        let formData = new FormData();
        formData.append('file', this.file);
        let response = await PostsService.uploadDataTraining(formData);
        this.successAlert = []
        if(response.data.status){
            this.successAlert.push(response.data.message);
            this.showAlert()
            this.isLoading=true
            this.isLoadingAttr=true
            this.firstLoad()
            // setTimeout("location.reload(true);",2000);
        }
        
    },
    async fetchDataLabel() {
      let response = await PostsService.getAllLabel();
      return response.data;
    },
    async fetchDataAttributes() {
      let response = await PostsService.getAllAttributes();
      return response.data;
    },
     getRowCount (items) {
      return items.length
    },
    checkSession() {
      /**
       * check session and do action
       */
      if (!window.localStorage.getItem("token")) {
        this.$router.push({ name: "Login" });
      } else {
        if (window.localStorage.getItem("role") != Constants.ROLE_ADMIN) {
          // redirect to 404 page
          this.$router.push({ name: "Page404" });
        } else {
          this.firstLoad();
        }
      }
    },
    async firstLoad() {
      let responseData = await this.fetchDataLabel();
      let responseDataAttr = await this.fetchDataAttributes();
      let labelData = responseData.data;
      this.tableItems = labelData;
      this.isLoading=false
      let attrData = responseDataAttr.data;
      this.tableItemsAttr = attrData;
      this.isLoadingAttr = false
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
