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
            <v-toolbar-title>Edit Parent Details of {{student.name}}</v-toolbar-title>
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
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Parent Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateStudentParent',
  async asyncData({$axios, params}) {
    let student = await $axios.get(`/students/${params.studentId}`)
    student = student.data.data
    let parent = await $axios.get(`/students/${params.studentId}/parents/${params.parentId}`)
    parent = parent.data.data
    let batches = await $axios.get('/batches');
    batches = batches.data.data.map(batch => ({
      'text': batch.name,
      'value': batch.id 
    }));
    return {
      student: student,
      batches: batches,
      form: parent
    }
  },
  data: () => ({
    form: {
      student_id: '',
      name: '',
      email: '',
      phone: '',
      role_id: ''
    }
  }),
  components: {
    BackButton
  },
  mounted() {
    this.form.student_id = this.$route.params.studentId;
  },
  methods: {
    async store() {
      let parent = await this.$axios.patch(`/students/${this.$route.params.studentId}/parents/${this.$route.params.parentId}`, this.form)
      this.$router.push('/students')
    }
  }
}
</script>