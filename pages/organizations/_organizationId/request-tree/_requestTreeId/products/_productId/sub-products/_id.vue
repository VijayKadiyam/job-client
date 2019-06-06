<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Sub Products"
      :link="`/organizations/${organization.value}/request-tree/${listing.id}/products/${product.id}/sub-products`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Edit Sub Product of {{ product.name }} | {{ listing.name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="public" 
                name="name" 
                label="Name"
                v-model="form.name" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Sub Product</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateSubProduct',
  async asyncData({$axios, params}) { 
    let listing = await $axios.get(`/listings/${params.requestTreeId}`);
    let product = await $axios.get(`/listings/${params.requestTreeId}/products/${params.productId}`);
    let sub_product = await $axios.get(`/products/${params.productId}/sub_products/${params.id}`);
    return {
      listing: listing.data.data,
      product: product.data.data,
      form: sub_product.data.data
    }
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.patch(`/products/${this.$route.params.productId}/sub_products/${this.$route.params.id}`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/request-tree/${this.listing.id}/products/${this.product.id}/sub-products`);
    }
  }
}
</script> 