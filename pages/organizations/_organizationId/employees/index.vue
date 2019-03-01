<template>
  <section>
    <span class="title">Manage Employees</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/employees/create`"
      :color="baseColor"
      title="Add New Employee"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="employees"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.email }}<br>{{ props.item.phone }}</td>
        <td>{{ props.item.doj }}</td>
        <td>{{ props.item.dob }}</td>
        <td>{{ props.item.company_designation.name }}</td>
        <td>{{ props.item.company_state_branch ? props.item.company_state_branch.name : '-' }}</td>
        <td>{{ props.item.supervisors.length ? props.item.supervisors[0].name : '' }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/employees/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageEmployees',
  async asyncData({$axios, params}) { 
    let employees = await $axios.get(`/users?role_id=3`);
    return {
      employees: employees.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Email/Phone', value: 'phone' },
      { text: 'DOJ', value: 'doj' },
      { text: 'DOB', value: 'dob' },
      { text: 'Designation', value: 'designation' },
      { text: 'Branch', value: 'branch' },
      { text: 'Supervisor', value: 'supervisor' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>