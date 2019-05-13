<template>
<div>
   <bounce-spinner v-if="isLoading"></bounce-spinner>
  <div class="animated fadeIn" v-if="isLoading==false">
      <b-card-group class="mb-4">
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{peternakRegistered}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Farmers Registered</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="info" :value="peternakRegistered"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-people"></i>
          </div>
          <div class="h4 mb-0">{{sapiRegistered}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Cows Registered</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="success" :value="sapiRegistered"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-feed"></i>
          </div>
          <div class="h4 mb-0">{{deviceOnline}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Device Online</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="warning" :value="deviceOnline"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-ghost"></i>
          </div>
          <div class="h4 mb-0">{{deviceOffline}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Device Offline</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" :value="deviceOffline"/>
        </b-card>
        <b-card>
          <div class="h1 text-muted text-right mb-4">
            <i class="icon-clock"></i>
          </div>
          <div class="h4 mb-0">{{devicePending}}</div>
          <small class="text-muted text-uppercase font-weight-bold">Device Pending</small>
          <b-progress height="{}" class="progress-xs mt-3 mb-0" variant="danger" :value="devicePending"/>
        </b-card>
      </b-card-group>
    <b-row>
      <b-col md="12">
        <b-card header="Farmers List" class="card-accent-warning">
          <b-table
            class="mb-0 table-outline"
            striped
            responsive="sm"
            hover
            :items="tableItems"
            :fields="tableFields"
            head-variant="light"
          >
            <div slot="key-nama" slot-scope="data">
              <img src="img/avatars/breder.jpg" width="50px" alt="farmers logo">
              <strong> {{data.item.peternak_docs[0].nama}}</strong>
            </div>
            <div slot="key-alamat" slot-scope="data">
              <i class="icon-direction"></i>
              <strong> {{data.item.peternak_docs[0].alamat}}</strong>
            </div>
            <div slot="key-telphone" slot-scope="data">
             
             <h5><b-badge variant="warning">{{data.item.peternak_docs[0].noTelp}}</b-badge></h5>
            
            </div>
          </b-table>
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
import 'vue-spinners/dist/vue-spinners.css';
import { BounceSpinner } from 'vue-spinners/dist/vue-spinners.common';

export default {
  name: "Admin",
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
      isLoading: true,
      peternakRegistered: 0,
      sapiRegistered: 0,
      deviceOnline: 0,
      deviceOffline: 0,
      devicePending: 0,
      selected: "Month",
      tableItems: [],
      tableFields: [
        {
          key:'key-nama',
          label: 'Name'
        },
        {
          key:'key-alamat',
          label: 'Address'
        },
        {
          key:'key-telphone',
          label: 'Telephone'
        },
      ]
    };
  },
  created() {
    this.checkSession();
  },
  methods: {
    async fetchDataPeternak() {
      let response = await PostsService.getAllPeternak(
        window.localStorage.getItem("token")
      );
      return response.data;
    },
    async fetchDataSapi() {
      let response = await PostsService.getAllSapi(
        window.localStorage.getItem("token")
      );
      return response.data;
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
      var active = 0,
        nonactive = 0,
        pending = 0;
      let response = await this.fetchDataPeternak();
      let responseDataSapi = await this.fetchDataSapi();
      let peternakData = response.data;
      let sapiData = responseDataSapi.data;
      this.isLoading=false
      this.peternakRegistered = peternakData.length;
      this.sapiRegistered = sapiData.length;
      for (var i = 0; i < sapiData.length; i++) {
        switch (sapiData[i].perangkat.status) {
          case Constants.DEVICE_ACTIVE:
            active++;
            break;
          case Constants.DEVICE_NONACTIVE:
            nonactive++;
            break;
          default:
            pending++;
        }
      }
      this.tableItems = peternakData;
      this.deviceOnline = active;
      this.deviceOffline = nonactive;
      this.devicePending = pending;
    },
    variant(value) {
      let $variant;
      if (value <= 25) {
        $variant = "info";
      } else if (value > 25 && value <= 50) {
        $variant = "success";
      } else if (value > 50 && value <= 75) {
        $variant = "warning";
      } else if (value > 75 && value <= 100) {
        $variant = "danger";
      }
      return $variant;
    },
    flag(value) {
      return "flag-icon flag-icon-" + value;
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
