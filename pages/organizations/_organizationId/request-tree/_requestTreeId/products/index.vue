<template>
  <section>
    <span class="title">Manage Products of {{ listing.name }}</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/request-tree/${listing.id}/products/create`"
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
      :items="products"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td>
          <div v-for="(subProduct, i) in props.item.sub_products"
            :key="`subProduct${i}`"
          >
            {{ subProduct.name }}
          </div>
        </td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/request-tree/${listing.id}/products/${props.item.id}`">
            <v-btn
              :dark="darkStatus"
              :color="baseColor" fab small>
              <v-icon>edit</v-icon>
            </v-btn>
          </nuxt-link>
          <nuxt-link :to="`/organizations/${organization.value}/request-tree/${listing.id}/products/${props.item.id}/sub-products`">
            <v-btn
              :dark="darkStatus"
              :color="baseColor" small>
              <!-- <v-icon>add</v-icon> -->
              Manage Sub Products
            </v-btn>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageProducts',
  async asyncData({$axios, params}) { 
    let listing = await $axios.get(`/listings/${params.requestTreeId}`);
    let products = await $axios.get(`/listings/${params.requestTreeId}/products`);
    return {
      products: products.data.data,
      listing: listing.data.data
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
      { text: 'Sub Products', value: 'sub_products' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    console.log(this.listing)
    this.loading = false
  }
}
</script>