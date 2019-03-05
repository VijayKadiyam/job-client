<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Sales"
      :link="`/sales`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Edit sales amount</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.amount"
                prepend-icon="attach_money" 
                name="amount" 
                label="Amount"
                v-model="form.amount" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Sales Amount</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'
import moment from 'moment'

export default {
  name: 'EditSales',
  async asyncData({$axios, params}) {
    let sales = await $axios.get(`/user_sales/${params.id}`)
    return {
      form: sales.data.data
    }
  },
  data: () => ({
    form: {
      date: '',
      amount: ''
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      this.form.date = moment(new Date()).format("YYYY-MM-DD")
      await this.$axios.patch(`/user_sales/${this.$route.params.id}`, this.form)
      this.$router.push(`/sales`);
    }
  }
}
</script> 