<template>
  <section>
    <v-layout align-center justify-center row wrap>
      <v-flex xs12 sm1 md1>
        <span class="subheading">Question:</span>
      </v-flex>
      <v-flex xs12 sm10 md10>
        <ckeditor :editor="editor" v-model="question.detail" :config="editorConfig"></ckeditor>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center row wrap pt-3>
      <v-flex xs12 sm1 md1>
        <span class="subheading">Answer:</span>
      </v-flex>
      <v-flex xs12 sm10 md10>
        <v-text-field
          v-model="subjective_answers[0].answer"
          label="Integer answer"
          type="number"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <br>
    <v-divider></v-divider>
    <br>

    <v-layout align-center justify-center row wrap>
      <v-flex xs12 sm1 md1>
        <span class="subheading">Solution:</span>
      </v-flex>
      <v-flex xs12 sm10 md10>
        <ckeditor :editor="editor" v-model="question_solutions[0].solution" :config="editorConfig"></ckeditor>
      </v-flex>
    </v-layout>

    <!-- <v-btn
      @click="$emit('getUpdatedForm', updatedForm)"
    >Check</v-btn> -->
  </section>
</template>

<script type="text/javascript">
import Vue from 'vue'

export default {
  name: 'AssertionReasoning',
  data: () => ({
    updatedForm: {},
    question: '',
    subjective_answers: '',
    editor: '',
    editorConfig: {
      height: '100px',
    },
    maxOptions: false
  }),
  props: ['form'],
  created() {
    this.updatedForm =  this.form
    this.updatedForm.questions = [
      {
        detail: '',
        question_subjective_answers: [
          {
            answer: ''
          }
        ],
        question_solutions: [
          {solution: ''}
        ]
      }
    ];

    this.question = this.updatedForm.questions[0];
    this.subjective_answers = this.updatedForm.questions[0].question_subjective_answers
    this.question_solutions = this.updatedForm.questions[0].question_solutions

    var ckeditor = require("@ckeditor/ckeditor5-vue");
    var ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
    this.editor = ClassicEditor
    Vue.use(ckeditor);
  }
}
</script>