<template>
  <section>
    <span class="title">Manage Branches of State: {{ state.name }}</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/states/${$route.params.stateId}/branches/create`"
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
      :items="branches"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/states/${$route.params.stateId}/branches/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageStatesBranches',
  async asyncData({$axios, params}) { 
    let state = await $axios.get(`/company_states/${params.stateId}`);
    let branches = await $axios.get(`/company_states/${params.stateId}/company_state_branches`);
    return {
      state: state.data.data,
      branches: branches.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Branch Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>