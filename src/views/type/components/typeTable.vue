<template>
    <div :style="styleObj">
        <Table :height="height" :columns="tableColumns" :data="tableData"></Table>
    </div>
</template>

<script>
export default {
    name: 'typeTable',
    data () {
        return {
            
        };
    },
    props: {
        styleObj: Object,
        height: String,
        tableData: Array,
        tableColumns:Array,
    },
};
</script>
