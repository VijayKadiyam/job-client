<template>
  <section>
    <!-- Title -->
    <back-button 
      title="Go Back To Question"
      link="/manage-data/questions"
    ></back-button>
    <span class="title">Add Question</span>
    <br><br>
    <!-- Add Question Type Section -->
    <v-btn-toggle
      v-model="form.question_type_id"
      class="transparent button-group"
      active-class="button-active"
      :mandatory=true
    >
      <v-btn
        v-for="(type, t) in question_types"
        :key="t"
        :value="type.id"
      >
        {{ type.name }}
      </v-btn>
    </v-btn-toggle>
    <!-- End Add Question Type Section -->
    <!-- Add Difficuly level, Subjects, Chapters Section -->
    <br><br>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md2 px-2>
        <v-select
          :error-messages="errors.difficulty_level_id"
          v-model="form.difficulty_level_id"
          :items="difficulty_levels"
          label="Difficulty Level"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6 md2 px-2>
        <v-select
          :error-messages="errors.subject_id"
          v-model="form.subject_id"
          :items="subjects"
          label="Subject"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6 md4 px-2>
        <v-select
          :error-messages="errors.subject_chapter_id"
          v-model="form.subject_chapter_id"
          :items="subject_chapters"
          label="Chapter"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6 md5 px-2>
        <v-select
          :error-messages="errors.subject_chapter_topic_id"
          v-model="form.subject_chapter_topic_id"
          :items="subjects"
          label="Sub Topic"
        ></v-select>
      </v-flex>
    </v-layout>
    <!-- End Add Difficulty Level, Subjects, chapters Section -->
    <v-divider></v-divider>
    <br>
    <!-- Assertion Reasoning -->
    <no-ssr placeholder="Loading...">
      <assertion-reasoning
        v-if="form.question_type_id == 1"
        :form="form"
      ></assertion-reasoning>
      <comprehension
        v-if="form.question_type_id == 2"
        :form="form"
      ></comprehension>
      <integer
        v-if="form.question_type_id == 3"
        :form="form"
      ></integer>
      <mmc
        v-if="form.question_type_id == 4"
        :form="form"
      ></mmc>
      <mac
        v-if="form.question_type_id == 5"
        :form="form"
      ></mac>
      <sac
        v-if="form.question_type_id == 6"
        :form="form"
      ></sac>
      <subjective
        v-if="form.question_type_id == 7"
        :form="form"
      ></subjective>
    </no-ssr>
    <!-- End Assertion Reasoning -->

    <span class="error-text" v-if="!isEmpty(errors)"><br>Please fill the complete data </span>
    <br>
    <v-divider></v-divider>
    <br>
    <v-btn
      block
      :color="baseColor"
      :dark="darkStatus"
      @click="addQuestion"
    >
      Submit New Question For Review
    </v-btn>
  </section>
</template>

<script type="text/javascript">
import AssertionReasoning from '@/components/question-types/assertion-reasoning.vue'
import comprehension from '@/components/question-types/comprehension.vue'
import integer from '@/components/question-types/integer.vue'
import mmc from '@/components/question-types/mmc.vue'
import mac from '@/components/question-types/mac.vue'
import sac from '@/components/question-types/sac.vue'
import subjective from '@/components/question-types/subjective.vue'
import BackButton from '@/components/back-button.vue'

export default {
  name: 'AddQuestion',
  async asyncData({$axios}) {
    let question_types = await $axios.get('/question_types');
    let subjects = await $axios.get('/subjects');
    subjects = subjects.data.data.map(subject => ({
      'text': subject.name,
      'value': subject.id 
    }));
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
      subjects: subjects,
      difficulty_levels: difficulty_levels,
      all_chapters: all_chapters
    }
  },
  data: ()  =>  ({
    form: {
      question_meta_passages: [],
      organization_id: 1,
      question_type_id: 1,
      subject_id: 1,
      subject_chapter_id: '',
      subject_chapter_topic_id: 1,
      difficulty_level_id: '',
      questions: []
    }
  }),
  computed: {
    subject_chapters() {
      // this.form.subject_chapter_id = ""
      return this.all_chapters.filter(chapter => chapter.subject_id == this.form.subject_id)
    }
  },
  components: {
    AssertionReasoning, comprehension, integer, mmc, mac, sac, subjective, BackButton
  },
  methods: {
    async addQuestion() {
      await this.$axios.post('question_metas', this.form);
      this.$router.push('/manage-data/questions');
    },
    // if the error is there or not
    isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
    }
  }
}
</script>