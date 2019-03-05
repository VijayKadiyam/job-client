<template>
  <section>
    <span class="title">Your Sales</span>
    <v-btn
      small
      fab
      :to="`/sales/create`"
      :color="baseColor"
      title="Add New Sales"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="user_sales"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.date }}</td>
        <td>&#36; {{ props.item.amount }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/sales/${props.item.id}`">
            <v-icon>edit</v-icon>
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
    let user_sales = await $axios.get(`/user_sales`);
    return {
      user_sales: user_sales.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Amount', value: '' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>