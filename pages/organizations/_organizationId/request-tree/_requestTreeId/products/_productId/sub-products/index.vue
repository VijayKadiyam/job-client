<template>
  <section>
    <span class="title">Manage Sub Products of {{ product.name }} </span> [ {{ listing.name }} ]
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/request-tree/${listing.id}/products/${product.id}/sub-products/create`"
      :color="baseColor"
      title="Add New Sub Product"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="sub_products"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/request-tree/${listing.id}/products/${product.id}/sub-products/${props.item.id}`">
            <v-btn
              :dark="darkStatus"
              :color="baseColor" fab small>
              <v-icon>edit</v-icon>
            </v-btn>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageSubProducts',
  async asyncData({$axios, params}) { 
    let listing = await $axios.get(`/listings/${params.requestTreeId}`);
    let product = await $axios.get(`/listings/${params.requestTreeId}/products/${params.productId}`);
    let sub_products = await $axios.get(`/products/${params.productId}/sub_products`);
    return {
      sub_products: sub_products.data.data,
      product: product.data.data,
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
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>