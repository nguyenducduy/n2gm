<template>
  <div class="pagination" v-if="totalItems > 0">
    <el-button type="text" icon="el-icon-arrow-left" :disabled="previousPage === 0"
      @click="handlePageChange(previousPage)">
      Previous
    </el-button>
    <span class="text">Page {{ currentPage }} / {{ totalPage }}</span>
    <el-button type="text" :disabled="nextPage > totalPage"
      @click="handlePageChange(nextPage)">
      Next &nbsp;
      <i class="el-icon-arrow-right"></i>
    </el-button>
    &nbsp;
    <div class="el-limit-filter">
      <el-select v-model="perPage" @change="onChangeLimit()" size="mini">
        <el-option
          v-for="item in showRecord"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
const querystring = require('querystring');

@Component
export default class Pagination extends Vue {
  @Prop() totalItems: number
  @Prop() currentPage: number;
  @Prop() recordPerPage: number;

  perPage: string = "30";
  showRecord: any = [
    {
      value: "30",
      label: "30"
    },
    {
      value: "50",
      label: "50"
    },
    {
      value: "100",
      label: "100"
    },
    {
      value: "300",
      label: "300"
    }
  ];

  get previousPage() { return this.currentPage -1; }

  get nextPage() { return this.currentPage + 1; }

  get totalPage() { return Math.ceil(this.totalItems / this.recordPerPage);}

  handlePageChange(page) {
    let queryObject = Object.assign({}, this.$route.query);
    queryObject.page = page;
    const pageUrl = `?${querystring.stringify(queryObject)}`;

    return this.$router.push(pageUrl);
  }

  onChangeLimit() {
    let queryObject = Object.assign({}, this.$route.query);
    queryObject.limit = this.perPage;
    const pageUrl = `?${querystring.stringify(queryObject)}`;

    return this.$router.push(pageUrl)
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: inline-block;
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 6px;
  height: 50px;

  .text {
    margin-left: 10px;
    margin-right: 10px;
    color: #9a9898;
    font-size: 12px;
  }

  .el-limit-filter {
    float: right;
    margin-top: 6px;
    .el-select {
      width: 70px;
    }
  }
}
</style>
