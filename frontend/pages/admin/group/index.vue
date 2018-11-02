<template>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';
import Breadcrumb from '~/components/admin/Breadcrumb.vue';
import Pagination from '~/components/admin/Pagination.vue';
import AddGroupForm from '~/components/admin/group/AddGroupForm.vue';
// import UserItems from '~/components/admin/user/Items.vue';
const querystring = require('querystring');

@Component({
  components: {
    Breadcrumb,
    Pagination,
    AddGroupForm,
    // UserItems
  }
})
export default class GroupIndexPage extends Vue {
  pageLoading: boolean = false;
  form: any = {};

  head() {
    return {
      title: this.$t('pages.admin.group.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.admin.group.title')
        }
      ]
    };
  }

  // onFilter() {
  //   this.query.page = 1;
  //   const pageUrl = `?${querystring.stringify(
  //     this.form
  //   )}&${querystring.stringify(this.query)}`;

  //   return this.$router.push(pageUrl);
  // }


}
</script>
