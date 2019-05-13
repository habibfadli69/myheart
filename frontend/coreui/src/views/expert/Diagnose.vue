<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col lg="12" md="12">
          <!-- show-progress -->
          <!-- <b-progress :value="progress_counter" variant="warning" :max="progress_max" animated></b-progress> -->
           
         </b-col>
      </b-row>
      <br>
      <b-row>
         <b-col lg="2" md="2">
         </b-col>
         <b-col lg="8" md="8">
           <b-card class="card-accent-warning"
        header-tag="header"
        footer-tag="footer">
        <div slot="header">
           <img src="img/cow/cow (2).png" width="50px" alt="CoreUI Logo"><strong> Cow</strong>
          <!-- <div class="card-header-actions">
            <a href="https://bootstrap-vue.js.org/docs/components/progress" class="card-header-action" rel="noreferrer noopener" target="_blank">
              <small class="text-muted">docs</small>
            </a>
          </div> -->
        </div>
        <div>
          <h6 class="text-muted" style="text-align:center">Please fill yes or no in the symptom survey below to find out what is happening to your cow</h6>
          <!-- <ul id="example-1">
            <li v-for="item in dataAttribute" :key="item._id">
              {{ item.namaAttribute }}
            </li>
          </ul> -->
          <b-tabs pills v-model="tabIndex">
            <b-tab v-for="(item, index) in dataAttribute" :key="item.attributeIdentitiy" >
              <h3> {{ item.namaAttribute }}</h3>
              <br>
              <b-form-group :label-cols="1" :horizontal="true">
                <b-form-radio-group
                  stacked>
                  
                     <label>
                      
                      <input type="radio" 
                            v-bind:value="1" 
                            v-bind:name="index" 
                            v-model="userResponses[index]"> Yes
                    </label>
                    <br>
                    <label>
                      <input type="radio" 
                            v-bind:value="0" 
                            v-bind:name="index" 
                            v-model="userResponses[index]"> No
                    </label>
                  
                </b-form-radio-group>
              </b-form-group>
            </b-tab>
           
          </b-tabs>
          <hr>
          <table style="float:right">
            <tr>
              <td>
                  <b-btn v-if="tabIndex > 0" class="mt-4" variant="warning" @click="prev">Previous</b-btn>      
              </td>
              <td>
                  <b-btn v-if="tabIndex < progress_max-1" class="mt-4" id="asd"  variant="warning" @click="clicked">Next Step</b-btn>
                  <b-btn v-if="progress_max+1 < tabIndex+3" class="mt-4" id="asd2"  variant="danger" @click="doDiagnose">Diagnose</b-btn>
              
              </td>
              </tr>
          </table>
        </div>
      </b-card>
      <b-card header="System Advice" class="card-accent-danger">
         <b-progress v-if="ansArray.length == 0" :value="progress_counter" variant="warning" :max="progress_max" animated></b-progress>
        <!-- <h5 class="text-muted" style="text-align:center" v-if="ansArray.length > 0">System Advice</h5> -->
          <div role="tablist" v-if="ansArray.length > 0">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-btn block href="#" v-b-toggle.accordion1 variant="danger">{{ansArray[0]}}</b-btn>
              </b-card-header>
              <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card no-body>
                    <b-tabs>
                      <b-tab active>
                          <template slot="title">
                            <strong>Symptoms summary</strong>
                          </template>
                           <b-table striped outlined stacked="sm" hover :items="tableItems" :fields="tableFields" head-variant="light">
                          <div slot="key-question" slot-scope="data">
                            {{data.item.namaAttributes}}
                           
                          </div>
                          <div slot="key-answer" slot-scope="data">
                            
                            <b-badge :variant="getStatus(data.item.nilai)">{{data.item.nilai == 0 ? "No" : "Yes"  }}</b-badge>
                          </div>
                          </b-table>
                      </b-tab>
                      <b-tab>
                          <template slot="title">
                            <strong>Prevention advice</strong>
                          </template>
                          <ul>
                            <li>
                              Keep the cage clean
                            </li>
                            <li>
                              Clean the mammary glands regularly
                            </li>
                            <li>
                              Use antiseptics (iodine and chlorine fluids.) for dyeing nipples before and after milking
                            </li>
                          </ul>
                      </b-tab>
                       <b-tab>
                          <template slot="title">
                            <strong>Treatment advice</strong>
                          </template>
                          <ul>
                            <li>
                              Administration of cloxacillin antibiotics when dry cages
                            </li>
                            <li>
                              Give Suanovil (spiramycin) antibiotics directly to the nipple
                            </li>
                            
                          </ul>
                      </b-tab>
                    </b-tabs>
                  </b-card>
                </b-card-body>
              </b-collapse>
            </b-card>
            
          </div>
      </b-card>
         </b-col>
         <b-col lg="2" md="2">
         </b-col>
      </b-row>
 
    </div>
  </div>
</template>

<script>
import Constants from "@/services/Constants"
import PostsService from "@/services/PostsService"
export default {
  name: 'expert',
  data () {
    return {
      tabIndex: 0,
      progress_counter: 0,
      progress_max: 0,
      dataAttribute:[],
      userResponses: [],
      ansArray:[],
      tableItems: [],
      tableFields: [
        {
          key:'key-question',
          label: 'Symptoms'
          
        },
        {
          key:'key-answer',
          label:'Condition'
        }
      ],
      bars: [
        {variant: 'success', value: 75},
        {variant: 'info', value: 75},
        {variant: 'warning', value: 75},
        {variant: 'danger', value: 75},
        {variant: 'primary', value: 75},
        {variant: 'secondary', value: 75},
        {variant: 'dark', value: 75}
      ],
      timer: null,
      striped: true,
      animate: true,
      max3: 100,
      values: [ 15, 30, 20 ]
    }
  },
  created(){
    this.checkSession(); 
  },
  methods: {
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
    async fetchDataAttribute(){
      const response = await PostsService.getAllAttributes();
      return response.data;
    },
    async firstLoad(){
      // console.log(window.localStorage.getItem("token"));
      const response = await this.fetchDataAttribute();
      let attributeData = response.data;
      this.dataAttribute = attributeData
      this.progress_max = this.dataAttribute.length
      this.userResponses = Array(this.dataAttribute.length).fill(0)
      // console.log(this.dataAttribute[0].namaAttribute)
      
    },
    async ToServer(params,id_sapi){
      const response = await PostsService.testingData(params,id_sapi);
      return response.data;
    },
    getStatus(tmp){
      return tmp == 0 ? 'danger' : 'success'
    },
    clicked () {
      // console.log(this.tabIndex)
      if(this.progress_counter == this.progress_max){
        // console.log("max===")
        this.progress_counter = this.progress_max
      }else{
        this.tabIndex++;
        this.progress_counter++; 
      }
    },
    prev () {
      this.ansArray=[]
      if(this.progress_counter == 0){
        this.tabIndex = 0;
        this.progress_counter = 0;
      }else{
        this.tabIndex--;
        this.progress_counter--;
      }
      
    },
    async doDiagnose(){
      if(this.progress_counter == this.progress_max){
        // console.log("max===")
        this.progress_counter = this.progress_max
      }else{
        this.progress_counter++
      }
      
      var objData = [{}] // empty array
      for(var i=0;i<this.dataAttribute.length;i++){
        objData[0][this.dataAttribute[i].namaAttribute] = this.userResponses[i]
      }
      const response = await this.ToServer(objData[0],this.$route.params.id)
      let dataFinal = response.data
      this.ansArray.push(dataFinal.diagnose)
      this.tableItems = dataFinal.gejala
      // console.log(objData[0])
    }
  }
}
</script>

