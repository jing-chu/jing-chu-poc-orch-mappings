<template>
  <div class="container">
    <Info @getIdAndIntent="getData" />
    <Mappings 
    v-for="mapping in mappings" 
      :key="mapping.customer_id + mapping.customer_key"
      :bot_intent="mapping.bot_intent"
      :operation="mapping.operation"
      :customer_id="mapping.customer_id"
      :customer_key="mapping.customer_key"
      :info="mapping.info"
    />
    
  </div>
</template>

<script>
import Info from '../components/Info'
import Mappings from '../components/Mappings'
import axios from 'axios'

export default {
  components: {
      Info,
      Mappings,
    },

  data() {
    return {
      customer_id: '',
      bot_intent: '',
      mappings:[]
    }
  },

  methods: {
    async getData (id, intent) {
      this.customer_id = id
      this.bot_intent = intent
      //console.log("IIIIITENT: ", this.bot_intent)
      //console.log("IDIDIDIDID: ", this.customer_id)
      try {
      const params = JSON.stringify({
        "route": "get-all-items",
        "customer_id": this.customer_id
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
      const cunstomerMappings = res.data.output.Items
      this.mappings = cunstomerMappings.filter((intentMappings) => {
        return intentMappings.bot_intent == this.bot_intent
      })
      console.log("myMappings: ", this.mappings)
    } catch (err) {
      console.log(err)
    }
    }
  
  }
  
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
