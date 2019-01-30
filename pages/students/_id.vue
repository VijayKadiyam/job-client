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
            <v-toolbar-title>Edit student</v-toolbar-title>
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
                disabled
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
                :error-messages="errors.batch_id"
                v-model="form.batch_id"
                :items="batches"
                label="Batch"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Student</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'EditStudent',
  async asyncData({$axios, params}) {
    let student = await $axios.get(`/students/${params.id}`)
    student = student.data.data
    student.batch_id = student.batches ?  student.batches[0].id : ''
    let batches = await $axios.get('/batches');
    batches = batches.data.data.map(batch => ({
      'text': batch.name,
      'value': batch.id 
    }));
    return {
      batches: batches,
      form: student
    }
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      let student = await this.$axios.patch(`/students/${this.$route.params.id}`, this.form)
      let batch_payload = {
        user_id: student.data.data.id,
        batch_id: this.form.batch_id
      }
      await this.$axios.post('/assign_batches', batch_payload)
      this.$router.push('/students')
    }
  }
}
</script>