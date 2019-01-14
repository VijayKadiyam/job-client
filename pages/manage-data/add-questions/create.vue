<template>
  <section>
    <!-- Title -->
    <v-btn
      small
      fab
      to='/manage-data'
      :color="baseColor"
      title="Go Back To Questions"
    >
      <v-icon>
        arrow_back
      </v-icon>
    </v-btn>
    <span class="title">Add Question</span>
    <br><br>
    <!-- Add Question Type Section -->
    <v-toolbar dense>
      <v-btn-toggle
        v-model="form.question_type_id"
        class="transparent button-group"
      >
        <v-btn
          v-for="(type, t) in question_types"
          :key="t"
          :value="type.id"
        >
          {{ type.name }}
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <!-- End Add Question Type Section -->
    <!-- Add Subjects Section -->
    <br>
    <v-toolbar dense>
      <v-btn-toggle
        v-model="form.subject_id"
        class="transparent button-group"
      >
        <v-btn
          flat
          v-for="(subject, s) in subjects"
          :key="s"
          :value="subject.id"
        >
          {{ subject.name }}
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <!-- End Add Subjects Section -->
    <!-- Difficulty Level and Chapters -->
    <br>
    <v-divider></v-divider>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md3 px-2>
        <v-select
          v-model="form.difficulty_level_id"
          :items="difficulty_levels"
          label="Difficulty Level"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6 md3 px-2>
        <v-select
          v-model="form.subject_chapter_id"
          :items="subject_chapters"
          label="Chapters"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <br>
    <!-- End Difficulty Level and Chapters -->
    <assertion-reasoning
      :form="form"
      @getUpdatedForm="updateForm"
    ></assertion-reasoning>
  </section>
</template>

<script type="text/javascript">

import AssertionReasoning from '@/components/question-types/AssertionReasoning.vue'

export default {
  name: 'AddQuestion',
  async asyncData({$axios}) {
    let question_types = await $axios.get('/question_types');
    let subjects = await $axios.get('/subjects');
    let difficulty_levels = await $axios.get('/difficulty_levels');
    difficulty_levels = difficulty_levels.data.data.map(level => ({
      'text': level.name,
      'value': level.id 
    }));
    let all_chapters = await $axios.get(`/chapters`);
    all_chapters = all_chapters.data.data.map(chapter => ({
      'text':  chapter.name,
      'value':  chapter.id,
      'subject_id': chapter.subject_id
    }))

    return {
      question_types: question_types.data.data,
      subjects: subjects.data.data,
      difficulty_levels: difficulty_levels,
      all_chapters: all_chapters
    }
  },
  data: ()  =>  ({
    form: {
      question_type_id: 1,
      subject_id: 1,
      subject_chapter_id: '',
      difficulty_level_id: ''
    }
  }),
  computed: {
    subject_chapters() {
      this.form.subject_chapter_id = ""
      return this.all_chapters.filter(chapter => chapter.subject_id == this.form.subject_id)
    }
  },
  components: {
    AssertionReasoning
  },
  methods: {
    updateForm(updatedForm) {
      this.form = updatedForm
    }
  }
}
</script>

<style type="text/css" scoped>
.button-group {
  width: 100% !important;
}
</style>