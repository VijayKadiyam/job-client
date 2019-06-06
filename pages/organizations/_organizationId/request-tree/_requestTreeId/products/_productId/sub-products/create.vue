<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Products"
      :link="`/organizations/${organization.value}/request-tree/${listing.id}/products/${product.id}/sub-products`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Sub Product of {{ product.name }} | {{ listing.name }}</v-toolbar-title>
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
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Sub Product</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateSubProduct',
  async asyncData({$axios, params}) { 
    let listing = await $axios.get(`/listings/${params.requestTreeId}`);
    let product = await $axios.get(`/listings/${params.requestTreeId}/products/${params.productId}`);
    return {
      listing: listing.data.data,
      product: product.data.data,
    }
  },
  data: () => ({
    form: {
      name: '',
      position: 1
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      await this.$axios.post(`/products/${this.product.id}/sub_products`, this.form)
      this.$router.push(`/organizations/${this.organization.value}/request-tree/${this.listing.id}/products/${this.product.id}/sub-products`);
    }
  }
}
</script> 