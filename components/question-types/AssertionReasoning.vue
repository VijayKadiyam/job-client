<template>
  <section>
    <v-layout align-center justify-center>
      <v-flex xs12 sm3 md3>
        <span class="subheading">Question</span>
      </v-flex>
      <v-flex xs12 sm9 md9>
        
      </v-flex>
    </v-layout>

    <!-- <v-btn
      @click="$emit('getUpdatedForm', updatedForm)"
    >Check</v-btn> -->
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'AssertionReasoning',
  data: () => ({
    updatedForm: {}
  }),
  props: ['form'],
  created() {
    this.updatedForm = this.form;
    this.updatedForm.questions = "Checking";
  },
  methods: {
  }
}
</script>