<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Employees"
      :link="`/organizations/${organization.value}/users`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create User</v-toolbar-title>
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
              <v-text-field 
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.phone"
                prepend-icon="phone" 
                name="phone" 
                label="Phone" 
                v-model="form.phone"
                type="number"
              ></v-text-field>
              <v-select
                :error-messages="errors.can_send_email"
                prepend-icon="build" 
                v-model="form.can_send_email"
                :items="checks"
                label="Can Send Emails"
              ></v-select>

              Select Products
              <v-container>
                <v-layout row wrap>
                  <v-flex>
                    <div
                      v-for="(listing, i) in listings"
                      :key="i"
                    >
                      {{ listing.name }}
                      <div
                        v-for="(product, j) in listing.products"
                        :key="j"
                      >
                        <v-checkbox 
                        :color="baseColor" 
                        hide-details 
                        v-model="selected"
                        :value="product.id"
                        :label="product.name"
                        @click="updateProduct(product.id)"
                      ></v-checkbox>
                      </div>
                      <br>
                      <br>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update User</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateUser',
  async asyncData({$axios, params}) {
    let employee = await $axios.get(`users/${params.id}`)
    let listings = await $axios.get(`listings`);
    return {
      form: employee.data.data,
      listings: listings.data.data
    }
  },
  data: () => ({
    selectedUser: {},
    selected: [],
    form: {
      name: '',
      email: '',
      phone: '',
      active: 1,
      role_id: 3
    },
    checks: [
      {
        text: 'Can Send Email',
        value: 1
      },
      {
        text: 'Cannot Send Email',
        value: 0
      }
    ]
  }),
  created() {
    this.selectedUser = this.form
    this.updateSelected()
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      this.form.active = 1
      let user = await this.$axios.patch(`/users/${this.form.id}`, this.form)
      // await this.forceLogout()
      this.$router.push(`/organizations/${this.organization.value}/users`);
    },

    async updateProduct(productId)
    {
      // ProductUser
      let product_user = {
        user_id: this.form.id,
        product_id: productId
      }
      console.log(product_user);
      let user = {}
      if(this.selected.find(select => select == productId))
        user = await this.$axios.post('/product_user?op=unassign', product_user)
      else
        user = await this.$axios.post('/product_user?op=assign', product_user)
      this.selectedUser = user.data.data
      this.updateSelected()
    },

    updateSelected() {
      this.selected = []
      this.selectedUser.products.forEach(product => {
        this.selected.push(product.id)
      })
    },

    async forceLogout() {
      let user = {
        user_id: this.form.id
      }
      this.$axios.post('/logout', user)
    },
  }
}
</script> 