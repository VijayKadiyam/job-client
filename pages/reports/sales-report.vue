<template>
  <section>
    <span class="title">Sales Report</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="month"
          :items="users"
          label="Select Month"
          @input="fetchSales(month, user_id)"
        ></v-select>
      </v-flex>
      <v-flex md3 pl-3>
        <v-select
          v-model="user_id"
          :items="users"
          label="Select Employee"
          @input="fetchSales(month, user_id)"
        ></v-select>
      </v-flex>
    </v-layout>
    <no-ssr>
      <download-excel
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
      v-if="user_id"
      :headers="headers"
      :items="plans"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.date }}</td>
        <td>{{ props.item.plan }}</td>
        <td>{{ props.item.allowance_type ? props.item.allowance_type.name : '' }}</td>
        <td>{{ props.item.allowance_type ? props.item.allowance_type.amount : '' }}</td>
        <td>{{ props.item.plan_actuals.length ? (props.item.plan_actuals[0].status == 1 ? 'Visited' : 'Not Visited') : '' }}</td>
        <td>{{ props.item.plan_actuals.length ? props.item.plan_actuals[0].details : '' }}</td>
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
    month: '',
    months: [],
    loading: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'date'
      },
      { text: 'Plan', value: 'plan' },
      { text: 'Allowance Type', value: 'allowance_type' },
      { text: 'Allowance Amount', value: 'allowance_amount' },
      { text: 'Status', value: 'status' },
      { text: 'Details', value: 'details' },
    ],
    plans: [],
    json_fields: {
      'Sr No': 'sr_no',
      'User': 'user',
      'Date': 'date',
      'Plan': 'plan',
      'Allowance Type': 'allowance_type',
      'Allowance Amount': 'allowance_amount',
      'Status': 'status',
      'Details': 'details',
    },
    json_data: [],
    json_meta: [
      [
        {
          'key': 'charset',
          'value': 'utf-8'
        }
      ]
    ],
  }),
  methods: {
    async fetchSales(month, user_id) {
      let months = moment.months();
      for(let i = 0; i < months.length ; i++) {
        this.months.push({
          'text': months[i],
          'value': '0' + (i + 1)
        })
      }
      console.log(this.months)
      console.log(user_id)
      // this.plans = await this.$axios.get(`/plans?user_id=${user_id}`);
      // this.plans = this.plans.data.data
      // console.log(this.plans)

      // this.plans.forEach((plan, i) => {
      //   this.json_data.push({
      //     sr_no: i + 1,
      //     user: plan.user.name,
      //     date: plan.date,
      //     plan: plan.plan,
      //     allowance_type: plan.allowance_type ? plan.allowance_type.name : '',
      //     allowance_amount: plan.allowance_type ? plan.allowance_type.amount : '',
      //     status: plan.plan_actuals.length ? (plan.plan_actuals[0].status == 1) ? 'Visited' : 'Not Visited' : '',
      //     details: plan.plan_actuals.length ? plan.plan_actuals[0].details : '',
      //   })
      // })
    }
  }
}
</script>