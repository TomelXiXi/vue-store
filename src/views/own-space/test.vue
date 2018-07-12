<style lang="less">
    @import "../../../styles/common.less";
</style>

<template>
    <div>      
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=60%
            loading="loading"
            @on-ok="ok"
            @on-cancel="cancel"
            :transfer="false">      
           <skuSelect ref="choosePro" @showModal="showModal()" @hideModal="hideModal()" :selectSkuList="selectSkuList"></skuSelect>
         </Modal>
        <!--商品信息区域-->
        <Row>
            <Col span="24" >
                <Card  v-if="selectSkuList.length == 0">
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        选取sku
                    </p>
                    <Row>
                        <Col span="12">
                            <Steps :current="0" >
                                <Step title="选取sku"></Step>
                                <Step title="维护组合商品信息"></Step>
                                <Step title="验证保存"></Step>
                            </Steps>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Col span="12">
                            <Button type="dashed" size="large" @click="selectSku">点击选取sku</Button>
                        </Col>
                    </Row>
                </Card> 

                <Card  v-if="selectSkuList.length != 0">
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        sku列表
                    </p> 
                    <Row>
                        <Col span="12">
                            <Steps :current="1" >
                                <Step title="选取sku"></Step>
                                <Step title="维护组合商品信息"></Step>
                                <Step title="验证保存"></Step>
                            </Steps>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Col span="12">
                            <Button type="dashed" size="large" @click="selectSku">点击选取sku</Button>
                        </Col>
                    </Row>

                </Card>
            </Col>
        </Row>
        <!--按钮区域-->
        <Row class="margin-top-8" type="flex"  align="middle" justify="end">           
            <Button type="primary" @click="addProduct('formValidate')">确认新增</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </Row>
    </div>
</template>

<script>
import axios from 'axios';
import {baseUrl} from '../../../conf/env';
import skuSelect from '@/views/product/sku/sku-select.vue'
export default {
    components:{
          skuSelect
    },
    data () {
        return {
        	selectSkuList:[],
            modal:false,
            modalTitle:'选取sku',
            
            
        };
    },
    computed: {
        
    },
    created(){
        this.init();
    },
    methods:{
    	selectSku(){
            this.modal = true;
    	},
        ok(){
            console.log(this.selectSkuList);
            this.modal=false;
        },
        cancel(){

        },
        showModal(){
            this.modal = true;
        },
        hideModal(){
            this.modal = false;
        },
        init(){
            
        },
    }
};
</script>