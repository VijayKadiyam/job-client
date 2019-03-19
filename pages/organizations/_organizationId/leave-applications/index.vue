<template>
  <section>
    <span class="title">Manage Your Leave Applications</span>
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
        <td>{{ props.item.company_leave.name }}</td>
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
          <nuxt-link :to="`/organizations/${organization.value}/leave-applications/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageLeaveApplications',
  async asyncData({$axios, params}) { 
    let leave_applications = await $axios.get(`/user_applications`);
    return {
      leave_applications: leave_applications.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Leave Name',
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
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>