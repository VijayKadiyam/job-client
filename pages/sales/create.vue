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
            <v-toolbar-title>Add Today's Sales</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.customer_name"
                prepend-icon="person" 
                name="customer_name" 
                label="Customer Name"
                v-model="form.customer_name" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.phone_no"
                prepend-icon="phone" 
                name="phone_no" 
                label="Customer Phone No"
                v-model="form.phone_no" 
                type="text"
              ></v-text-field>
              <v-menu
                ref="dateMenu"
                :close-on-content-click="false"
                v-model="dateMenu"
                :nudge-right="40"
                :return-value.sync="form.doj"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.date"
                  slot="activator"
                  v-model="form.date"
                  label="Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="form.date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dateMenu.save(form.date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
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
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Add Sales</v-btn>
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
  name: 'CreateSales',
  data: () => ({
    form: {
      customer_name: '',
      date: '',
      amount: ''
    },
    dateMenu: false
  }),
  components: {
    BackButton
  },
  mounted() {
    this.form.date = moment(new Date()).format("YYYY-MM-DD")
  },
  methods: {
    async store() {
      await this.$axios.post(`/user_sales`, this.form)
      this.$router.push(`/sales`);
    }
  }
}
</script> 