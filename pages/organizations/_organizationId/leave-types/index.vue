<template>
  <section>
    <span class="title">Manage Leave Types</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/leave-types/create`"
      :color="baseColor"
      title="Add New Leave Type"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="leave_types"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
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
  name: 'ManageBreakTypes',
  async asyncData({$axios, params}) { 
    let leave_types = await $axios.get(`leave_types`);
    return {
      leave_types: leave_types.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Leave Type',
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