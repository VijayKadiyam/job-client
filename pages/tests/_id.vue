<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Tests"
      link="/tests"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update a test</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="card_membership" 
                name="name" 
                label="Name"
                v-model="form.name" 
                type="text"></v-text-field>
              <v-select
                :error-messages="errors.test_pattern_id"
                v-model="form.test_pattern_id"
                :items="test_patterns"
                label="Test Pattern"
              ></v-select>
              <v-select
                :error-messages="errors.duration"
                v-model="form.duration"
                :items="durations"
                label="Test Duration (in minutes)"
              ></v-select>
              <v-textarea
                :error-messages="errors.description"
                label="Test Description"
                v-model="form.description"
              ></v-textarea>
              <v-textarea
                :error-messages="errors.instructions"
                label="Test Instructions"
                v-model="form.instructions"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Test</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateTest',
  async asyncData({$axios, params}) {
    let test = await $axios.get(`/tests/${params.id}`)
    test = test.data.data
    test.test_pattern_id = parseInt(test.test_pattern_id);
    let test_patterns = await $axios.get('/test_patterns');
    test_patterns = test_patterns.data.data.map(pattern => ({
      'text': pattern.name,
      'value': pattern.id 
    }));
    return {
      form: test,
      test_patterns: test_patterns
    }
  },
  data: () => ({
    durations: ['30', '60', '90', '120', '150', '180', '210', '240']
  }),
  components: {
    BackButton
  },
  mounted() {
  },
  methods: {
    async store() {
      await this.$axios.patch(`tests/${this.$route.params.id}`, this.form);
      this.$router.push('/tests');
    }
  }
}
</script>