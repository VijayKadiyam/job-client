<template>
  <section>
    <span class="title">Manage Allowance Types</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/allowance-types/create`"
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
      :items="break_types"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.amount }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/allowance-types/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageAllowanceTypes',
  async asyncData({$axios, params}) { 
    let break_types = await $axios.get(`allowance_types`);
    return {
      break_types: break_types.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Allowance Type',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Amount', value: 'amount' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>