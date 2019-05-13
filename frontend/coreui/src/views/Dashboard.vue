<template>
<div>
    <bounce-spinner v-if="isLoading"></bounce-spinner>
  <div class="animated fadeIn" v-if="isLoading==false">
  
    <b-row>
      <b-alert show variant="success" v-if="successAlert.length > 0">
              <h4 class="alert-heading">Congratulation !</h4>
              <ul>
                <li v-for="item in successAlert" :key="item">{{ item }}</li>
              </ul>
              
      </b-alert>
      <b-col sm="6" lg="6">
        <b-card  bg-variant="info" text-variant="white">
          <h1 class="card-text">
            {{DeviceActive}} 
          </h1>
          <p>Active Device</p>
        </b-card>
       
      </b-col>
      <b-col sm="6" lg="6">
        <b-card  bg-variant="danger" text-variant="white">
          <h1 class="card-text">
            {{DeviceNonActive}}
          </h1>
          <p>Nonactive Device</p>
        </b-card>

      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-card header="Cow List" class="card-accent-warning">
           <div slot="header">
              <b>Cow List</b>
              <div class="card-header-actions">
                <b-button type="button" variant="warning" @click="showModal" class="mr-1">Register Cow</b-button>
             
              </div>
          </div>
          <b-row>        
             <b-col sm="12" lg="12">
              <b-row v-if="existingData == true">
                <b-col sm="6">
                  <Callout variant="info">
                    <b-row>
                      <b-col sm="12" lg="6">
                        <small class="text-muted">Temperature Average</small><br>
                        <strong class="h4">{{ TemperatureAverage }}</strong>
                      </b-col>
                      <b-col sm="12" lg="6">
                    <!-- <div class="chart-wrapper"> -->
                      <!--<callout-chart-example :data="[35, 23, 56, 22, 97, 23, 64]" variant="#20a8d8" width="80" height="30" />-->
                        <callout-chart-example chartId="callout-chart-01" :labels="labelsData" :data="TemperatureGraph" variant="info" width="80" height="30" />
                    <!-- </div> -->
                      </b-col>
                    </b-row>
                  </Callout>
                </b-col>
                <b-col sm="6">
                  <Callout variant="danger">
                    <b-row>
                      <b-col sm="12" lg="6">
                        <small class="text-muted">Heart Rate Average</small><br>
                        <strong class="h4">{{HeartRateAverage}}</strong>
                      </b-col>
                      <b-col sm="12" lg="6">
                        <!-- <div class="chart-wrapper"> -->
                        <callout-chart-example chartId="callout-chart-02" :labels="labelsData" :data="HeartGraph" variant="danger" width="80" height="30" />
                        <!-- </div> -->
                      </b-col>
                    </b-row>
                  </Callout>
                </b-col>
              </b-row>
              <hr class="mt-0">
             </b-col>
          </b-row>
          <b-row>
            <b-table striped outlined stacked="sm" hover :items="tableItems" :fields="tableFields" head-variant="light"  v-if="existingData == true">
            <div slot="namaSapi" slot-scope="data">
              <img src="img/cow/cow (2).png" width="50px" alt="cows logo">
              <strong>{{data.value}}</strong>
              <b-link class="card-header-action btn-minimize" v-b-toggle.collapse1>
                  <i v-bind:id="data.item._id" class="icon-eye"></i>
              </b-link>
              <b-popover v-bind:target="data.item._id" title="Cow ID">
                <!-- <strong>{{data.item._id}}</strong> -->
                <h5><b-badge variant="secondary">{{data.item.perangkat.idOnRaspi}}</b-badge></h5>
              </b-popover>
              <!-- <div class="small text-muted">{{data.item._id}}</div> -->
            </div>
            <div slot="key-kondisi" slot-scope="data">
              <b-badge :variant="getKondisi(data.item.perangkat.data[data.item.perangkat.data.length-1].kondisi)">{{data.item.perangkat.data[data.item.perangkat.data.length-1].kondisi == 0 ? "Abnormal":"Normal"}}</b-badge>
            </div>
            <div slot="key-tanggal" slot-scope="data">
              <b-badge :variant="dateFormatter(data.item.perangkat.data[data.item.perangkat.data.length-1].tanggal)">{{data.item.perangkat.data[data.item.perangkat.data.length-1].tanggal | formatDate}}</b-badge>
              
            </div>
            <div slot="key-suhu" slot-scope="data">
              
              <strong>{{data.item.perangkat.data[data.item.perangkat.data.length-1].suhu.toFixed(2)}}</strong>
              <div class="small text-muted">Celcius</div>
            </div>
            <div slot="key-jantung" slot-scope="data">
              
              <strong>{{data.item.perangkat.data[data.item.perangkat.data.length-1].jantung.toFixed(2)}}</strong>
              <div class="small text-muted">BPM</div>
            </div>
            <div slot="key-status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.perangkat.status)">{{ data.item.perangkat.status == 0 ? "Nonactive": data.item.perangkat.status == 1 ? "Active":"Pending" }}</b-badge>
            </div>
            <div slot="key-action" slot-scope="data">
              <b-button variant="primary" size="sm" @click="toDetail(data.item._id)">Show Details</b-button>
            </div>
            <div slot="key-expert" slot-scope="data">
              <b-button variant="success" size="sm" @click="toExpert(data.item._id)">Identification</b-button>
            </div>
          </b-table> 
            
          </b-row> 
            <b-alert v-if="existingData == false" show variant="warning">
              You don't have a cow in our system, let's manage your first cow by clicking the register cow button.
            </b-alert>
        </b-card>
      </b-col>
    </b-row>
          
    <b-modal variant="warning" class="modal-warning"  ref="myModalRef" hide-footer title="Register">
      <div class="d-block text-center">
        <b-alert show variant="danger" v-if="errors.length > 0">
              <h4 class="alert-heading">Error !</h4>
              <ul>
                <li v-for="item in errors" :key="item">{{ item }}</li>
              </ul>
              <hr>
              <p class="mb-0">
               Please check again your form field.
              </p>
          </b-alert>
        <b-form-group>
          <b-form-input type="text" id="name" v-model="cowName" placeholder="Enter your cow ID or name"></b-form-input>
        </b-form-group>
      </div>
      <b-btn class="mt-3" variant="outline-warning" block @click="createCow">Register</b-btn>
    </b-modal>


  </div>
</div>
</template>

<script>
import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
import CardLine2ChartExample from './dashboard/CardLine2ChartExample'
import CardLine3ChartExample from './dashboard/CardLine3ChartExample'
import CardBarChartExample from './dashboard/CardBarChartExample'
import MainChartExample from './dashboard/MainChartExample'
import SocialBoxChartExample from './dashboard/SocialBoxChartExample'
import CalloutChartExample from './dashboard/CalloutChartExample'
import { Callout } from '@coreui/vue'
import io from 'socket.io-client'
import PostsService from "@/services/PostsService"
import Constants from "@/services/Constants"
import 'vue-spinners/dist/vue-spinners.css'
import { BounceSpinner } from 'vue-spinners/dist/vue-spinners.common'
import moment from 'moment'


export default {
  name: 'dashboard',
  filters:{
    formatDate : function(value){
      if (value) {
        return moment(String(value)).format('DD-MMM-YYYY HH:mm:ss')
      }
    }
  },
  components: {
    Callout,
    // myComponent,
    BounceSpinner,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  data() {
    return {
      isLoading: true,
      DeviceActive:0,
      cowName:"",
      socket : io(Constants.SOCKET_SERVER),
      warningModal: false,
      DeviceNonActive:0,
      TemperatureAverage:0,
      HeartRateAverage:0,
      TemperatureGraph:[],
      HeartGraph:[],
      labelsData:[],
      CurrentConditions:"",
      suhuArrange:[],
      statusDeviceInStr:"",
      dateOnFormat:"",
      dateOnFormatForAvg:"",
      existingData:false,
      sapiList:[],
      selected: 'Month',
      tableItems: [],
      errors: [],
      successAlert: [],
      tableFields: [
        {
          key:'namaSapi',
          label: 'Cow ID'
          
        },
        {
          key:'key-kondisi',
          label:'Current Condition'
        },
        { key: 'key-tanggal', 
          label: 'Time' 
        },
        { key: 'key-suhu', 
          label: 'Temperature' 
        },
        { key: 'key-jantung', 
          label: 'Heart Rate' 
        },
        { key: 'key-status', 
          label: 'Device Status'
        },
        {
          key: 'key-action',
          label: 'Details'
        },
        {
          key: 'key-expert',
          label: 'Diagnose'
        }
      ]
    }
  },
  created(){
      this.checkSession();
     
  },
  methods: {
    showModal () {
      /**
       * this function for show create cow form on modal
       */
      this.errors = []
      this.$refs.myModalRef.show()
    },
    async postCreateCowData() {
      /**
       * post create cow data
       */
      this.successAlert = []
      const response = await PostsService.createCow(window.localStorage.getItem("token"),{
                          namaSapi: this.cowName
                        });
      this.$refs.myModalRef.hide()
      if(response.data.status){
        this.successAlert.push('Congratulation,You have successfully register a new cow, our team will prepare your device, please refresh this page');
      }
      // setTimeout(location.reload(), 5000)
      
    },
    createCow() {
      /**
       * this function for action when register cow button on clik
       */
      if(this.cowName){
        
        this.postCreateCowData()
      }
      this.errors = []
      if(!this.cowName){
        this.errors.push('cow ID cant blank !');
      }
     
    },
    checkSession(){
      /**
       * check session and do action
       */
      if(!window.localStorage.getItem("token")){
        this.$router.push({ name: 'Login' })  
      }else{
        if(window.localStorage.getItem("role") != Constants.ROLE_FARMERS){
          // redirect to 404 page
          this.$router.push({ name: 'Page404' })    
        }else{
          this.firstLoad();
        }
        
      }
    },
    variant (value) {
      let $variant
      if (value <= 25) {
        $variant = 'info'
      } else if (value > 25 && value <= 50) {
        $variant = 'success'
      } else if (value > 50 && value <= 75) {
        $variant = 'warning'
      } else if (value > 75 && value <= 100) {
        $variant = 'danger'
      }
      return $variant
    },
    flag (value) {
      return 'flag-icon flag-icon-' + value
    },
    async fetchDataSapi(){
      const response = await PostsService.getSapi(window.localStorage.getItem("token"));
      return response.data;
    },
    soket(){
      this.socket.on('/topic/cows/'+window.localStorage.getItem("peternak_id"), (sapiData) => {
            this.tableItems = sapiData;
            var active =0,inActive =0,avgSuhu=0,avgHeart=0;
            for(var i=0;i<sapiData.length;i++){
            avgSuhu += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].suhu);
            avgHeart += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].jantung);
            this.dateFormatter(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].tanggal);
            if(sapiData[i].perangkat.status == 1){
              active++;
            }else{
              inActive++;
            }
          }
          avgSuhu = avgSuhu/sapiData.length;
          avgHeart = avgHeart/sapiData.length;
          this.tableItems = sapiData;
          this.DeviceActive = active;
          this.DeviceNonActive = inActive;
          this.TemperatureAverage = avgSuhu.toFixed(2);
          this.HeartRateAverage = avgHeart.toFixed(2);
          // chart operation
          this.HeartGraph.push(this.HeartRateAverage);
          this.TemperatureGraph.push(this.TemperatureAverage);
          this.labelsData.push(this.dateOnFormat)
            
      });
    },
    async firstLoad(){
      // console.log(window.localStorage.getItem("token"));
      const response = await this.fetchDataSapi();
      let sapiData = response.data;
      this.isLoading=false
      if(sapiData.length > 0){
          this.existingData = true
          var active =0,inActive =0,avgSuhu=0,avgHeart=0;
          for(var i=0;i<sapiData.length;i++){
            avgSuhu += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].suhu);
            avgHeart += Number(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].jantung);
            this.dateFormatter(sapiData[i].perangkat.data[sapiData[i].perangkat.data.length-1].tanggal);
            if(sapiData[i].perangkat.status == 1){
              active++;
            }else{
              inActive++;
            }
          }
          avgSuhu = avgSuhu/sapiData.length;
          avgHeart = avgHeart/sapiData.length;
          this.tableItems = sapiData;
          this.DeviceActive = active;
          this.DeviceNonActive = inActive;
          this.TemperatureAverage = avgSuhu.toFixed(2);
          this.HeartRateAverage = avgHeart.toFixed(2);
          // chart operation
          this.HeartGraph.push(this.HeartRateAverage);
          this.TemperatureGraph.push(this.TemperatureAverage);
          this.labelsData.push(this.dateOnFormat)
          // this.TemperatureGraph = [1,2,3,4,5,6,7]
          // this.labelsData = [1,2,3,4,5,6,7]
          this.soket();
      }else{
        this.existingData=false
      }
      
      // console.log(this.tableItems);
    },
    
    getBadge (status) {
      var varian_='danger'
      if(status==0){
        this.statusDeviceInStr="Nonactive";
      }else if(status==1){
        this.statusDeviceInStr="Active";
        varian_='success'
      }else{
        this.statusDeviceInStr="Pending"
        varian_='secondary'
      }
      // return status == 0 ? 'danger' : 'success'
      return varian_
    },
    getKondisi(tmp){
      return tmp == 0 ? 'danger' : 'success'
    },
    dateFormatter(date){
      var created_date = new Date(date);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = created_date.getFullYear();
      var month = months[created_date.getMonth()];
      var date = created_date.getDate();
      var hour = created_date.getHours();
      var min = created_date.getMinutes();
      var sec = created_date.getSeconds();
      var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;    // final date with time, you can use this according your requirement
      this.dateOnFormat = time;
      return 'secondary';
    },
    toExpert(id){
      this.$router.push({ name: 'expert', params: {id : id} })
    },
    toDetail (id){
      this.$router.push({ name: 'Details', params: {id : id} })
      
    }
  } 
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
  .list-sapi-header{
    color:white;
  }
  .brand-card-header{
    background-color: #ffc107 !important;
  }
  .chart-wrapper canvas{
    /* width: 100% !important;  */
    /* margin-top: -10% !important;
    height: 50px !important; */
  }
</style>
