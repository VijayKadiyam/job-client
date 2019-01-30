<template>
  <section>
    <!-- Question -->
    <v-layout align-center justify-center row wrap>
      <v-flex xs12 sm1 md1>
        <span class="subheading">Question:</span>
      </v-flex>
      <v-flex xs12 sm10 md10>
        <ckeditor :editor="editor" v-model="question.detail" :config="editorConfig"></ckeditor>
      </v-flex>
    </v-layout>
    <!-- End Question -->

    <!-- Options -->
    <v-radio-group v-model="question_option_answers[0].option_position">
      <v-layout align-center justify-center row wrap
        v-for="(option, o) in question.question_options"
        :key="o"
      >
        <v-flex xs12 sm1 md1 pt-3>
          <span class="subheading">
            <v-radio
              :color="baseColor"
              :label="option.name"
              :value="option.position"
            ></v-radio>
          </span>
        </v-flex>
        <v-flex xs12 sm10 md10 pt-3>
          <ckeditor :editor="editor" v-model="option.option" :config="editorConfig"></ckeditor>
        </v-flex>
      </v-layout>
    </v-radio-group>
    <!-- End Options -->

    <!-- Add/Remove Buttons -->
    <v-layout align-center justify-center>
      <v-flex xs12 sm1 md1 pt-3>
      </v-flex>
      <v-flex xs12 sm10 md10 pt-3>
        <v-btn
          @click="addMoreOptions"
          v-if="!maxOptions"
        >
          <v-icon>add</v-icon>
          Add More Option
        </v-btn>
        <v-btn
          @click="removeOption"
        >
          <v-icon>remove</v-icon>
          Remove Option
        </v-btn>
      </v-flex>
    </v-layout>
    <!-- End Add/Remove Buttons -->
    <br>
    <v-divider></v-divider>
    <br>

    <!-- Answer -->
    <v-layout align-center justify-center row wrap>
      <v-flex xs12 sm1 md1>
        <span class="subheading">Solution:</span>
      </v-flex>
      <v-flex xs12 sm10 md10>
        <ckeditor :editor="editor" v-model="question_solutions[0].solution" :config="editorConfig"></ckeditor>
      </v-flex>
    </v-layout>
    <!-- End Answer -->

    <!-- <v-btn
      @click="$emit('getUpdatedForm', updatedForm)"
    >Check</v-btn> -->
  </section>
</template>

<script type="text/javascript">
import Vue from 'vue'
import {VueMathjax} from 'vue-mathjax'

export default {
  name: 'AssertionReasoning',
  data: () => ({
    updatedForm: {},
    question: '',
    options: '',
    question_option_answers: '',
    question_solutions: '',
    editor: '',
    editorConfig: {
      ckfinder: {
        uploadUrl: require('@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js')
      },
      extraPlugins: '',
      // MathJax config
      mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML'
    },
    maxOptions: false
  }),
  props: ['form'],
  created() {
    this.updatedForm =  this.form
    this.updatedForm.questions = [
      {
        detail: '',
        question_options: [
          {name: 'A', option: '', position: 1}, 
          {name: 'B', option: '', position: 2}, 
          {name: 'C', option: '', position: 3}, 
          {name: 'D', option: '', position: 4}
        ],
        question_option_answers: [
          {
            option_position: ''
          }
        ],
        question_solutions: [
          {solution: ''}
        ],
        question_subjective_answers: [],
        question_matrix_left_columns: [],
        question_matrix_right_columns: [],
        question_matrix_answers: []
      }
    ];

    this.question = this.updatedForm.questions[0];
    this.options = this.updatedForm.questions[0].question_options
    this.question_option_answers = this.updatedForm.questions[0].question_option_answers
    this.question_solutions = this.updatedForm.questions[0].question_solutions

    var CKEDITOR = require("@ckeditor/ckeditor5-vue");
    var ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
    this.editor = ClassicEditor
    Vue.use(CKEDITOR);

    console.log(CKEDITOR)

    this.extraPlugins = require('@ckeditor/mathjax/plugin.js');
  },
  methods: {
    addMoreOptions() {
      if(this.options.length == 4)
        this.options.push({name: 'E', option: '', position: 5})
      else if(this.options.length == 5) {
        this.options.push({name: 'F', option: '', position: 6});
        this.maxOptions = true
      }
    },
    removeOption() {
      if(this.options.length > 4) {
        this.options.splice(this.options.length - 1, 1);
        this.maxOptions = false
      } else { alert('Minimum 4 options should be there') }
    }
  }
}
</script>