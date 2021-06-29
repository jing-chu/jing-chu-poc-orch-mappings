<template>
  <section>
    <h2>Orchestrator Info</h2>
    <form @submit.prevent="processForm"> 
      <div class="form-control">
        <label for="custmerId">Customer ID </label>
        <input type="text" v-model="customerId">
      </div>
      <div class="form-control">
        <label for="botIntent">Bot Intent </label>
        <select v-model="botIntent">
          <option disable value="">Please select one</option>
          <option>RETRIEVESUPPLIER</option>
          <option>RETRIEVECUSTOMER</option>
        </select>
      </div>
      <div class="buttons">
        <button type="button" @click="handleCancel">Cancel</button>
        <button type="submit">Submit</button>
      </div>    
    </form>    
  </section>    
</template>

<script>
export default {
  name: "Info",
  emits: ['getIdAndIntent'],
  data() {
    return {
    customerId:'',
    botIntent:''
    }  
  },
  methods: {
    processForm (event) {
      this.$emit('getIdAndIntent',this.customerId,this.botIntent)
    },
    handleCancel () {
      this.customerId=""
      this.botIntent=""
    }
  }
}
</script>


<style scoped>

form {
  min-height: 50vh;
  min-width: 50vh;
}
.form-control {
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
}

label {
  width: 15rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input, select {
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 2rem;
}

button {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
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