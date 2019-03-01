<template>
  <section>
    <span class="title">Manage Company Leave Types</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/leave-types/create`"
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
      :items="company_leaves"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.leaves }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/leave-types/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageCompanyLeaves',
  async asyncData({$axios, params}) { 
    let company_leaves = await $axios.get(`company_leaves`);
    company_leaves = company_leaves.data.data.filter(leave => leave.leave_pattern_id == 1)
    return {
      company_leaves: company_leaves
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
      { text: 'No of Leaves', value: 'leaves' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>