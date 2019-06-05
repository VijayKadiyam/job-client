<template>
  <section>
    <span class="title">Manage Req. Tree</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/request-tree/create`"
      :color="baseColor"
      title="Add New Req."
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="reqs"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/request-tree/${props.item.id}`">
            <v-btn
              :dark="darkStatus"
              :color="baseColor" fab small>
              <v-icon>edit</v-icon>
            </v-btn>
          </nuxt-link>
          <nuxt-link :to="`/organizations/${organization.value}/request-tree/${props.item.id}/products`">
            <v-btn
              :dark="darkStatus"
              :color="baseColor" fab small>
              <v-icon>add</v-icon>
            </v-btn>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageDesignations',
  async asyncData({$axios, params}) { 
    let reqs = await $axios.get(`/listings`);
    return {
      reqs: reqs.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Req. Name',
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