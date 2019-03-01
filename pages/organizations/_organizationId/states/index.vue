<template>
  <section>
    <span class="title">Manage Company States</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/states/create`"
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
      :items="states"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>
          <v-btn fab small
            :dark="darkStatus"
            :color="baseColor"
            :to="`/organizations/${organization.value}/states/${props.item.id}/branches`"
            title="Edit Branch's Details"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          {{ props.item.company_state_branches.map(b => b.name) }} 
        </td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/states/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
          <v-btn small
            :dark="darkStatus"
            :color="baseColor"
            :to="`/organizations/${organization.value}/states/${props.item.id}/branches/create`"
            title="Add Branch's Details"
          >
            <v-icon>add</v-icon>Add Branch
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageStates',
  async asyncData({$axios, params}) { 
    let states = await $axios.get(`/company_states`);
    return {
      states: states.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'State Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Branches', value: 'branches' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>