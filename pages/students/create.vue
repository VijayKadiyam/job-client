<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Students"
      link="/students"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create a new student</v-toolbar-title>
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
              <v-select
                :error-messages="errors.batch_ids"
                v-model="form.batch_ids"
                :items="batches"
                attach
                chips
                label="Batch"
                multiple
                :color="baseColor"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Student</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateStudent',
  async asyncData({$axios}) {
    let batches = await $axios.get('/batches');
    batches = batches.data.data.map(batch => ({
      'text': batch.name,
      'value': batch.id 
    }));
    return {
      batches: batches
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      role_id: '',
      organization_id: '',
      batch_ids: []
    }
  }),
  components: {
    BackButton
  },
  mounted() {
    // Student role id
    // this.form.role_id = (this.roles.find(role => role.text == 'Student')).value
    this.form.role_id = 3
    this.form.organization_id = this.organization.value
  },
  methods: {
    async store() {
      let student = await this.$axios.post('/students', this.form)
      // Assign Batch
      let batch_payload = {
        user_id: student.data.data.id,
        batch_ids: this.form.batch_ids
      }
      await this.$axios.post('/assign_batches', batch_payload)
      // Assign Role
      let role_payload = {
        user_id: student.data.data.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/assign_roles', role_payload)
      // Assign Organization
      let organization_payload = {
        user_id: student.data.data.id,
        organization_id: this.form.organization_id
      }
      await this.$axios.post('/assign_organizations', organization_payload)
      this.$router.push('/students')
    }
  }
}
</script>