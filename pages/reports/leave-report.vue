<template>
  <section>
    <span class="title">Leave Report</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="user_id"
          :items="users"
          label="Select Employee"
          @input="fetchLeaveApplications"
        ></v-select>
      </v-flex>
    </v-layout>
    <no-ssr>
      <download-excel
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "LeaveApplication.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr>
    <v-data-table
      v-if="user_id"
      :headers="headers"
      :items="leave_applications"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.company_leave.name }}</td>
        <td>{{ props.item.from_date }}</td>
        <td>{{ props.item.to_date }}</td>
        <td>{{ props.item.description }}</td>
        <td>{{ props.item.application_approvals.length ? props.item.application_approvals[0].status : 0 }}</td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">

import Vue from 'vue'

export default {
  name: 'LeaveReports',
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
        text: 'Leave Type',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'From Date', value: 'from_date' },
      { text: 'To Date', value: 'to_date' },
      { text: 'Description', value: 'description' },
      { text: 'status', value: 'status' },
    ],
    leave_applications: [],
    json_fields: {
      'Sr No': 'sr_no',
      'Leave type': 'leave_type',
      'From Date': 'from_date',
      'To Date': 'to_date',
      'Description': 'description',
      'Status': 'status'
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
    async fetchLeaveApplications(user_id) {
      this.leave_applications = await this.$axios.get(`/user_applications?user_id=${user_id}`);
      this.leave_applications = this.leave_applications.data.data

      this.leave_applications.forEach((application, i) => {
        this.json_data.push({
          sr_no: i + 1,
          leave_type: application.company_leave.name,
          from_date: application.from_date,
          to_date: application.to_date,
          description: application.description,
          status: application.status
        })
      })
    }
  }
}
</script>