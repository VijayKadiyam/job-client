<template>
  <section>
    <span class="title">Sales Report</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="month"
          :items="months"
          label="Select Month"
          @input="fetchSales(month, user_id)"
        ></v-select>
      </v-flex>
      <v-flex md3 pl-3>
        <v-select
          v-if="month"
          v-model="user_id"
          :items="users"
          label="Select Employee"
          @input="fetchSales(month, user_id)"
        ></v-select>
      </v-flex>
      <v-flex md3 pl-3>
        Total: $ {{ total }}/-
      </v-flex>
    </v-layout>
    <no-ssr>
      <download-excel
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "SaleReport.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr>
    <v-data-table
      v-if="user_id | month"
      :headers="headers"
      :items="user_sales"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.user.name }}</td>
        <td>{{ props.item.date }}</td>
        <td>{{ props.item.customer_name }}</td>
        <td>{{ props.item.phone_no }}</td>
        <td>&#36; {{ props.item.amount }}</td>
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
      { text: 'Employee Name', value: 'employee_name' },
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Customer Name', value: 'customer_name' },
      { text: 'Phone No', value: 'phone_no' },
      { text: 'Amount', value: 'amount' },
    ],
    user_sales: [],
    json_fields: {
      'Sr No': 'sr_no',
      'Employee name': 'employee_name',
      'Customer Name': 'customer_name',
      'Phone No': 'phone_no',
      'Amount': 'amount'
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
    total: 0
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
    async fetchSales(month, user_id) {
      let user_sales = await this.$axios.get(`/user_sales?month=${month}&user_id=${user_id}`);
      this.user_sales = user_sales.data.data

      this.total = 0;

      this.user_sales.forEach(sale => {
        this.total += parseInt(sale.amount)
      })

      this.user_sales.forEach((sale, i) => {
        this.json_data.push({
          'sr_no': i + 1,
          'employee_name': sale.user.name,
          'customer_name': sale.customer_name,
          'phone_no': sale.phone_no,
          'amount': sale.amount
        })
      })
    }
  }
}
</script>