<template>
  <base-card>
    <h2>Orchestrator {{operation.toUpperCase()}} Mappings</h2>
    <form @submit.prevent="saveMapping">   
      <div class="item" v-for="(i, index) in infoLocal" :key="index">
        <input class="input" type="text" v-model="i.key" :placeholder="i.key" />
        <input class="input" type="text" v-model="i.value" :placeholder="i.value" />
        <button button type="button" class="itemControl" @click="deleteItem(index)">-</button> 
      </div>
      <div class="btn">
        <button type="button" @click="handleCancel">Cancel</button>
        <button type="button" @click="addItem">Add</button>
        <button type="submit">Save</button>
      </div>
     </form>
    
  </base-card> 
</template>

<script>
import BaseCard from './BaseCard.vue'
import axios from 'axios'

export default {
  name: "Mappings",
  components: {
    BaseCard
  },
  // data() {
  //   return {
  //     initInfo: this.info
  //   }
  // },
  props:['customer_id', 'customer_key', 'bot_intent', 'operation', 'info'],
  computed: {
    infoLocal: {
      get() {
        const infoArr = Object.keys(this.info).map(key => ({ key: key, value : this.info[key] } ))
        //console.log("THIS>INFO: ", infoArr)
        return infoArr
      }, 
      set(newData) {
        this.info = newData
      }
    },
    initInfo: {
      get() {
        return Object.keys(this.info).map(key => ({ key: key, value : this.info[key] } ))
      }
    }
  },
  methods: {
    addItem() {
      this.infoLocal.push({key:"", value:""})
      this.$forceUpdate()
      console.log("ADDITEM", this.infoLocal)
    },
    deleteItem(index) {
      this.infoLocal.splice(index, 1)
      this.$forceUpdate()
      //console.log("DELETEITEM", this.infoLocal)
    },
    async saveMapping() {
      console.log("SAVED: ", this.infoLocal)
      const infoObj = this.infoLocal.reduce((obj, item) => (obj[item.key] = item.value, obj), {})
      this.infoLocal = infoObj
      console.log(this.info)
      try {
        const params = JSON.stringify({
        "route": "add-item",
        "customer_id": this.customer_id,
        "customer_key": this.customer_key,
        "bot_intent": this.bot_intent,
        "operation": this.operation,
        "info": this.info
      })
      const config = {
        method: 'post',
        url: 'https://pwwflte2r2.execute-api.us-east-1.amazonaws.com/reducrbotMappingsIntegration',
        headers: { 
          'content-type': 'application/json'
        },
        data : params
      }
      const res = await axios(config)
      console.log("RESRES: ", res)
      } catch (err) {
        console.log(err)
      }
    },
    handleCancel() {
      this.infoLocal= this.initInfo.reduce((obj, item) => (obj[item.key] = item.value, obj), {})
    }
  }
}
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: auto;
  width:25rem;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 2rem;
}

.input {
  margin:auto;
}

.itemControl {
  background-color:rgb(177, 53, 5);
  width:25px;
  height: 25px;
  color: white;
  border:none;
  padding: 2px 2px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  border-radius: 50%;
  margin:1rem;
}

button {
  text-decoration: none;
  padding: 0.5rem 1rem;
  font: inherit;
  background-color: #085b81;
  border: 1px solid #085b81;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  margin-right: 0.5rem;
  display: inline-block;
}
</style>
