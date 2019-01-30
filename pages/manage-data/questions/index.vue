<template>
  <section>
    <span class="title">Manage Questions</span>
    <v-btn
      small
      fab
      to='/manage-data/questions/create'
      :color="baseColor"
      title="Add New Question"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.unique_id }}</td>
        <td class="text-xs-left">{{ props.item.question_type }}</td>
        <td class="text-xs-left">{{ props.item.subject }}</td>
        <td class="text-xs-left">{{ props.item.chapter }}</td>
        <td class="text-xs-left">{{ props.item.difficulty_level }}</td>
        <td class="text-xs-left"></td>
        <td class="text-xs-left">
          <nuxt-link :to="`/manage-data/questions/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageQuestions',
  async asyncData({$axios}) { 
    let question_metas = await $axios.get('/question_metas');
    return {
      question_metas: question_metas.data.data
    }
  },
  data:() =>  ({
    items: [],
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'unique_id'
      },
      { text: 'Question Type', value: 'question_type' },
      { text: 'Subject', value: 'subject' },
      { text: "Chapter", value: 'chapter' },
      { text: "Difficulty Level", value: 'difficulty_level' },
      { text: 'History', value: 'history' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.question_metas.forEach(item => {
      this.items.push({
        id: item.id,
        unique_id: item.id,
        question_type: item.question_type.name,
        subject: item.subject.name,
        chapter: item.subject_chapter.name,
        difficulty_level: item.difficulty_level.name
      })
    })
    this.loading = false
  }
}
</script>