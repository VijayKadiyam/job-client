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
            <v-toolbar-title>Add admin details of {{ org.name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="person" 
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
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Admin</v-btn>
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
    let organization = await $axios.get(`/companies/${params.organizationId}`)
    let company_designations = await $axios.get(`/companies/${params.organizationId}/company_designations`)
    company_designations = company_designations.data.data.map(role => ({
      'text': role.name,
      'value': role.id 
    }));
    return {
      org: organization.data.data,
      company_designations: company_designations
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      active: 1,
      role_id: ''
    },
    dojDateMenu: false,
    dobDateMenu: false,
  }),
  mounted() {
    this.form.role_id = 2;
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      let admin = await this.$axios.post(`/users`, this.form)
      // Assign Role
      let role_payload = {
        user_id: admin.data.data.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/role_user', role_payload)
      // Assign Organization
      let organization_payload = {
        user_id: admin.data.data.id,
        company_id: this.$route.params.organizationId
      }
      await this.$axios.post('/company_user', organization_payload)
      this.$router.push('/organizations')
    }
  }
}
</script>