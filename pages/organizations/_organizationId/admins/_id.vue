<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Organizations"
      link="/organizations"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update admin details of {{ organization.name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="person" 
                name="name" 
                label="Name"
                v-model="form.name" 
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.phone"
                prepend-icon="phone" 
                name="phone" 
                label="Phone" 
                v-model="form.phone"
                type="number"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Admin</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateAdmin',
  async asyncData({$axios, params}) {
    let admin = await $axios.get(`/users/${params.id}`)
    admin = admin.data.data
    let organization = await $axios.get(`/organizations/${params.organizationId}`)
    return {
      form: admin,
      organization: organization.data.data
    }
  },
  mounted() {
    this.form.role_id = 1;
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      role_id: '',
      active: 1,
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      let admin = await this.$axios.patch(`/users/${this.$route.params.id}`, this.form)
      this.$router.push('/organizations')
    }
  }
}
</script>