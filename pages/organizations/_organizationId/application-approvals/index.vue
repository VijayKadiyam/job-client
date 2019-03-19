<template>
  <section>
    <span class="title">Manage Application Approvals</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/leave-applications/create`"
      :color="baseColor"
      title="Add New Designation"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="leave_applications"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.user.name }}</td>
        <td>{{ props.item.from_date }}</td>
        <td>{{ props.item.to_date }}</td>
        <td>{{ props.item.description }}</td>
        <td v-if="props.item.application_approvals.length"> 
          <div v-if="props.item.application_approvals[0].status == 0">
            Un Approved
          </div>
          <div v-if="props.item.application_approvals[0].status == 1">
            Approved
          </div>
          <div v-if="props.item.application_approvals[0].status == 2">
            On Hold
          </div>
        </td>
        <td v-else>
          On Hold
        </td>
        <td class="text-xs-left">
          <v-select
            v-model="props.item.status"
            :items="statuses"
            label="Change Status"
            @input="changeStatus(props.item.id, props.item.status)"
          ></v-select>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageApplicationApprovals',
  data:() =>  ({
    leave_applications: [],
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Employee Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'From Date', value: 'from_date' },
      { text: 'To Date', value: 'to_date' },
      { text: 'Description', value: 'description' },
      { text: 'Status', value: 'status' },
      { text: 'Action', value: '' }
    ],
    loading: true,
    statuses: [
      {
        text: 'UnApproved',
        value: 0
      },
      {
        text: 'Approved',
        value: 1
      },
      {
        text: 'On Hold',
        value: 2
      }
    ],
    formApproval: {
      'user_application_id': '',
      'supervisor_id': '',
      'status': '' 
    },
    status: ''
  }),
  async mounted() {
    await this.getUserApplications();
    this.loading = false
  },
  methods: {
    async getUserApplications() {
      this.leave_applications = []
      let leave_applications = await this.$axios.get(`/user_applications?user=supervisor`);
      leave_applications.data.data.forEach(app => {
        this.leave_applications.push({
          user: app.user,
          application_approvals: app.application_approvals,
          company_leave: app.company_leave,
          id: app.id,
          user_id: app.user_id,
          company_leave_id: app.company_leave_id,
          from_date: app.from_date,
          to_date: app.to_date,
          description: app.description,
          status: app.application_approvals.length ? parseInt(app.application_approvals[0].status) : ''
        })
      })
    },

    async changeStatus(applicationId, status) {
      this.formApproval.user_application_id = applicationId
      this.formApproval.supervisor_id = this.user.id,
      this.formApproval.status = status
      
      await this.$axios.post(`/user_applications/${applicationId}/application_approvals`, this.formApproval)
      this.getUserApplications();
    }
  }
}
</script>