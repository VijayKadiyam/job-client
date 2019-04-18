<template>
  <section>
    <span class="title">Plan Report</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="user_id"
          :items="users"
          label="Select Employee"
          @input="fetchPlans"
        ></v-select>
      </v-flex>
      <v-flex md3 pl-3>
        <v-select
          v-model="month"
          :items="months"
          label="Select Month"
          @input="fetchPlans"
        ></v-select>
      </v-flex>
      Grand Total : {{ grand_total }}
    </v-layout>
    <no-ssr>
      <download-excel
        :title = "title"
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "PlanReport.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr>
    <v-data-table
      :headers="headers"
      :items="table_data"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.sr_no }}</td>
        <td>{{ props.item.date }}</td>
        <td>{{ props.item.plan }}</td>
        <td>{{ props.item.from_to }}</td>
        <td>{{ props.item.way }}</td>
        <td>{{ props.item.fare }}</td>
        <td>{{ props.item.allowance_amount }}</td>
        <td>
          {{ props.item.status }}
          <v-btn
            v-if="props.item.details != 'Grand Total'"
            flat
            small
            color="blue"
            @click.stop="props.item.receiptDialog = true"
          >
            Receipt
          </v-btn>

          <v-dialog
            v-model="props.item.receiptDialog"
            max-width="290"
          >
            <v-card>
              <v-card-text>
                <h3>Receipt Details</h3>
                <table>
                  <tbody>
                    
                  </tbody>
                </table>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="props.item.receiptDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <td>{{ props.item.details }}</td>
        <td>{{ props.item.total }}</td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">

import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'PlanReports',
  async asyncData({$axios}) { 
    let users = await $axios.get('/users?search=all');
    users = users.data.data.map(user => ({
      'text': user.name,
      'value': user.id
    }))
    return {
      users: users
    }
  },
  data: () => ({
    user_id: '',
    loading: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Date',
        align: 'left',
        sortable: true,
        value: 'date'
      },
      { text: 'Plan', value: 'plan' },
      { text: 'From - To', value: 'from_to' },
      { text: 'Way', value: 'way' },
      { text: 'Fare', value: 'fare' },
      { text: 'Allowance Amount', value: 'allowance_amount' },
      { text: 'Status', value: 'status' },
      { text: 'Details', value: 'details' },
      { text: 'Total', value: 'total' },
    ],
    plans: [],
    vouchers: [],
    json_fields: {
      'Sr No': 'sr_no',
      'User': 'user',
      'Date': 'date',
      'Plan': 'plan',
      'From - To': 'from_to',
      'Way': 'way',
      'Fare': 'fare',
      'Allowance Amount': 'allowance_amount',
      'Status': 'status',
      'Details': 'details',
      'Total': 'total'
    },
    json_data: [],
    table_data: [],
    json_meta: [
      [
        {
          'key': 'charset',
          'value': 'utf-8'
        }
      ]
    ],
    months: [],
    month: '',
    grand_total: 0,
    title: ''
  }),
  created() {
    let months = moment.months();
    for(let i = 0; i < months.length ; i++) {
      this.months.push({
        'text': months[i],
        'value': '0' + (i + 1)
      })
    }
  },
  methods: {
    async fetchPlans() {
      if(this.month == '' || this.user_id == '')
        return;

      this.plans = await this.$axios.get(`/plans?user_id=${this.user_id}&month=${this.month}`);
      this.plans = this.plans.data.data

      this.vouchers = await this.$axios.get(`/vouchers?user_id=${this.user_id}&month=${this.month}`);
      this.vouchers = this.vouchers.data.data

      this.grand_total = 0
      let fare = 0
      let allowance_amount = 0
      let total = 0

      this.json_data = []
      let user = this.users.find(user => user.value == this.user_id)
      let month = this.months.find(month => month.value == this.month)
      this.title = 'Name:' + user.text + ' | Agency Name: PMS | Month: ' + month.text + ' 2019' 

      var j = 0;
      this.plans.forEach(plan => {
        fare = plan.plan_travelling_details.length ? plan.plan_travelling_details[0].fare : 0
        allowance_amount = plan.allowance_type ? plan.allowance_type.amount : 0
        total = parseInt(fare) + parseInt(allowance_amount)
        this.grand_total += total

        this.json_data.push({
          sr_no: j + 1,
          user: plan.user.name,
          date: plan.date,
          plan: plan.plan,
          from_to : plan.plan_travelling_details.length ? plan.plan_travelling_details[0].from + ' - ' + plan.plan_travelling_details[0].to : '',
          way: plan.plan_travelling_details.length ? plan.plan_travelling_details[0].travelling_way.name : '',
          fare: fare,
          allowance_amount: allowance_amount,
          status: plan.plan_actuals.length ? (plan.plan_actuals[0].status == 1) ? 'Visited' : 'Not Visited' : '',
          details: plan.plan_actuals.length ? plan.plan_actuals[0].details : '',
          total: total,
          receiptDialog: false
        })
        j++
      })

      this.fetchVouchers(j)

      this.json_data.push({
        sr_no: j + 1,
        details: 'Grand Total',
        total: this.grand_total
      })

      this.table_data = []
      this.json_data.forEach(data => {
        this.table_data.push(data)
      })
    },
    fetchVouchers(j) 
    {
      this.vouchers.forEach(voucher => {
        this.grand_total += voucher.amount
        this.json_data.push({
          sr_no: j + 1,
          details: voucher.voucher_type.name,
          total: voucher.amount
        })
        j++
      })
    }
  }
}
</script>