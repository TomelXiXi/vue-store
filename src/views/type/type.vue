 <style lang="less">
	.slide-fade-enter-active {
	  transition: all .5s ease;
	}
	.slide-fade-leave-active {
	  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to{
	  transform: translateX(10px);
	  opacity: 0;
	}
    @import "../../styles/common.less";
</style>

<template>
	<div>
		<Row span="24">
			<Col span="12" class="padding-right-4">
				<Card>
					<loading v-bind:spinShow='typeShow'></loading>
					<p slot="title">
                        <Icon type="ios-list"></Icon>
                        商品类型
                    </p>
                    <a href="#" slot="extra" @click.prevent="isAddType = !isAddType"  v-if="!isAddType">
                        <Icon type="plus-round"></Icon>
                        增加
                    </a>
                    <a href="#" slot="extra" @click.prevent="isAddType = !isAddType"  v-if="isAddType">
                        <Icon type="chevron-up"></Icon>
                        收起
                    </a>
                    <Row>
						<type-table :tableData="productTypeData" :tableColumns="productTypeColumns"
					height="281"></type-table>
					</Row>
					<transition name="slide-fade">
						<Form  ref="productTypeValidate" label-position="left" :model="productType" 
						:rules="productTypeValidate" :label-width="80"  v-if="isAddType">
							<Row class="margin-top-20">
								<Col  span="12">
									<FormItem prop="name" label="名称" >
		                                <Input v-model="productType.name" placeholder="请填写商品类别名称..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row>
								<Col  span="12">
									<FormItem prop="description" label="描述" >
		                                <Input v-model="productType.description" placeholder="请填写商品类别描述..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row type="flex" justify="end">
		                        <Col class="margin-right-10">
		                            <Button type="primary" @click="addProductType" >确认新增</Button>
		                        </Col>
		                    </Row>
						</Form>
					</transition>
				</Card>
			</Col>
			<Col span="12" class="padding-left-4">
				<Card>
					<loading v-bind:spinShow='classShow'></loading>
					<p slot="title">
                        <Icon type="ios-list"></Icon>
                        课程类型
                    </p>
                    <a href="#" slot="extra" @click.prevent="isAddClass = !isAddClass"  v-if="!isAddClass">
                        <Icon type="plus-round"></Icon>
                        增加
                    </a>
                    <a href="#" slot="extra" @click.prevent="isAddClass = !isAddClass"  v-if="isAddClass">
                        <Icon type="chevron-up"></Icon>
                        收起
                    </a>
                    <Row>
						<type-table :tableData="classTypeData" :tableColumns="classTypeColumns"
					height="281"></type-table>
					</Row>
					<transition name="slide-fade">
						<Form  ref="classTypeValidate" label-position="left" :model="classType" 
						:rules="classTypeValidate" :label-width="80"  v-if="isAddClass">
							<Row class="margin-top-20">
								<Col  span="12">
									<FormItem prop="optionKey" label="编号" >
		                                <Input v-model="classType.optionKey" placeholder="请填写课程类型编号..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row>
								<Col  span="12">
									<FormItem prop="optionValue" label="名称" >
		                                <Input v-model="classType.optionValue" placeholder="请填写课程类型名称..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row>
								<Col  span="12">
									<FormItem prop="description" label="描述" >
		                                <Input v-model="classType.description" placeholder="请填写课程类型描述..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row type="flex" justify="end">
		                        <Col class="margin-right-10">
		                            <Button type="primary" @click="addClassType" >确认新增</Button>
		                        </Col>
		                    </Row>
						</Form>
					</transition>
				</Card>
			</Col> 
		</Row>

		<Row span="24" class="margin-top-8">
			<Col span="12" class="padding-right-4">
				<Card>
					<loading v-bind:spinShow='primaryDisplayShow'></loading>
					<p slot="title">
                        <Icon type="ios-list"></Icon>
                        上架一级类别
                    </p>
                    <a href="#" slot="extra" @click.prevent="isAddPrimaryDisplay = !isAddPrimaryDisplay"  v-if="!isAddPrimaryDisplay">
                        <Icon type="plus-round"></Icon>
                        增加
                    </a>
                    <a href="#" slot="extra" @click.prevent="isAddPrimaryDisplay = !isAddPrimaryDisplay"  v-if="isAddPrimaryDisplay">
                        <Icon type="chevron-up"></Icon>
                        收起
                    </a>
                    <Row>
						<type-table :tableData="primaryDisplayData" :tableColumns="primaryDisplayColumns"
					height="281"></type-table>
					</Row>
					<transition name="slide-fade">
						<Form  ref="primaryDisplayValidate" label-position="left" :model="primaryDisplay" 
						:rules="primaryDisplayValidate" :label-width="80"  v-if="isAddPrimaryDisplay">
							<Row class="margin-top-20">
								<Col  span="12">
									<FormItem prop="label" label="名称" >
		                                <Input v-model="primaryDisplay.label" placeholder="请填写上架一级类别名称..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row type="flex" justify="end">
		                        <Col class="margin-right-10">
		                            <Button type="primary" @click="addPrimaryDisplay" >确认新增</Button>
		                        </Col>
		                    </Row>
						</Form>
					</transition>
				</Card>
			</Col>

			<Col span="12" class="padding-left-4">
				<Card>
					<loading v-bind:spinShow='displayShow'></loading>
					<p slot="title">
                        <Icon type="ios-list"></Icon>
                        上架二级类别
                    </p>
                    <a href="#" slot="extra" @click.prevent="isAddDisplay = !isAddDisplay"  v-if="!isAddDisplay">
                        <Icon type="plus-round"></Icon>
                        增加
                    </a>
                    <a href="#" slot="extra" @click.prevent="isAddDisplay = !isAddDisplay"  v-if="isAddDisplay">
                        <Icon type="chevron-up"></Icon>
                        收起
                    </a>
                    <Row>
						<type-table :tableData="displayData" :tableColumns="displayColumns"
					height="281"></type-table>
					</Row>
					<transition name="slide-fade">
						<Form  ref="displayValidate" label-position="left" :model="display" 
						:rules="displayValidate" :label-width="90"  v-if="isAddDisplay">
							<Row class="margin-top-20">
								<Col  span="12">
									<FormItem prop="displayLabel" label="名称" >
		                                <Input v-model="display.displayLabel" placeholder="请填写上架二级类别名称..." ></Input>
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row>
								<Col  span="12">
									<FormItem prop="primaryId" label="一级分类" >
		                                <Select v-model="display.primaryId" >
	                                        <Option v-for="item in primaryDisplayData" :value="item.id" :key="item.id">{{ item.label }}</Option> 
	                                    </Select> 
		                            </FormItem>
								</Col>
	                        </Row>
	                        <Row type="flex" justify="end">
		                        <Col class="margin-right-10">
		                            <Button type="primary" @click="addDisplay" >确认新增</Button>
		                        </Col>
		                    </Row>
						</Form>
					</transition>
				</Card>
			</Col>

		</Row>
	</div>
</template>

<script>
import typeTable from './components/typeTable.vue'
import loading from '../loading/loading'
import axios from 'axios'
import {baseUrl} from '../../conf/env'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
export default {
    components: {
        typeTable,loading
    },
    data () {
    	 const primaryIdValite  = (rule, value, callback) => {
            if (!value) {
                callback(new Error('所属一级类别为必选！'));
            }
            callback();         
        };
        return {
        	//商品类型
        	typeShow:false,
        	isAddType:false,
            productType:{
            	name:'',
            	description:'',
            },
            productTypeValidate:{
            	name:[
            		{ required: true, message: '类型名称不能为空', trigger: 'blur' }
            	],
            },
            productTypeData: [],
            productTypeColumns:[
                {
                    type: 'index',
                    title: '序号',
                },
            	{
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '描述',
                    key: 'description'
                },
            ],
            //课程类型
            classShow:false,
            isAddClass:false,
			classType:{
				optionKey:'',
            	optionValue:'',
            	description:'',
            },
            classTypeValidate:{
            	optionKey:[
            		{ required: true, message: '类型编号不能为空', trigger: 'blur' }
            	],
            	optionValue:[
            		{ required: true, message: '类型名称不能为空', trigger: 'blur' }
            	],
            },
            classTypeData: [],
            classTypeColumns:[
                {
                    type: 'index',
                    title: '序号',
                },
                {
                    title: '编号',
                    key: 'optionKey'
                },
            	{
                    title: '名称',
                    key: 'optionValue'
                },
                {
                    title: '描述',
                    key: 'description'
                },
            ],
            //上架一级类别
            primaryDisplayShow:false,
            isAddPrimaryDisplay:false,
			primaryDisplay:{
				label:''
            },
            primaryDisplayValidate:{
            	label:[
            		{ required: true, message: '类别名称不能为空', trigger: 'blur' }
            	],
            	
            },
            primaryDisplayData: [],
            primaryDisplayColumns:[
                {
                    type: 'index',
                    title: '序号',
                },
            	{
                    title: '名称',
                    key: 'label'
                },
                {
                    title: '创建时间',
                    key: 'createTime'
                },
            ],
            //上架二级类别
            primaryFilterList:[],
            displayShow:false,
            isAddDisplay:false,
			display:{
				displayLabel:'',
				primaryId:''
            },
            displayValidate:{
            	displayLabel:[
            		{ required: true, message: '类别名称不能为空', trigger: 'blur' }
            	],
            	primaryId:[
            		{ validator:primaryIdValite ,trigger: 'change' }
            	],
            },
            displayData: [],
            displayColumns:[
                {
                    type: 'index',
                    title: '序号',
                },
            	{
                    title: '名称',
                    key: 'displayLabel'
                },
                {
                    title: '一级类别',
                    key: 'primaryId',
                    render: (h, params) => {
                        let texts = '';
                        for(let i = 0 ; i < this.primaryDisplayData.length ; i ++){
                            if(this.primaryDisplayData[i].id == params.row.primaryId){
                                texts = this.primaryDisplayData[i].label;
                            }
                        }
                        return h('div', {  
                          props: {
                             },
                        },texts)
                    },
                    filters: this.primaryFilterList,
                        filterMethod (value, row) {
                        	let temp = row.primaryId + '';
                            return temp.indexOf(value) > -1;
                        }
                },
            ],

        };
    },
    computed: {
        
    },
    created(){
    	this.init();
    },
    methods:{
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
    		this.getProductType();
    		this.getClassType();
    		this.getPrimaryDisplay();
    	},
    	getDisplay(){
    		axios({
                method:'get',
                url:baseUrl + '/skuConf/findAllDisplay',
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取上架二级分类失败！");
                }else{
                    this.displayData = res.data;
                }
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取上架二级分类失败！");
            });
    	},
    	addDisplay(){
    		this.$refs['displayValidate'].validate((valid) => {
                if (valid) {
                	this.displayShow=true;
                	axios({
		                method:'post',
		                url:baseUrl + '/skuConf/addDisplay',
		                responseType:'json',
		                params:{
		                    displayLabel:this.display.displayLabel,
							primaryId:this.display.primaryId,
		                    createId:getCookie('userId')
		                },
		            }).then(res=> {
		                //console.log(res)
		                if(res.data.result == -2){
		                    console.log(res);
		                    this.error("保存上架二级类别失败！");
		                }else{
		                    this.getDisplay();
		                    this.$Message.success('保存成功!');
		                    this.display.displayLabel = ''
							//this.display.primaryId = ''
		                }
		                this.displayShow=false;
		            })
		            .catch(res=> {
		                console.log(res);
		                this.error("保存上架二级类别失败！");
		                this.displayShow=false;
		            });
                }
            })
    		
    	},
    	getPrimaryDisplay(){
    		axios({
                method:'get',
                url:baseUrl + '/skuConf/findAllPrimaryDisplay',
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取上架一级分类失败！");
                }else{
                    this.primaryDisplayData = res.data;
                    for(let i = 0 ; i < this.primaryDisplayData.length ; i ++){
                    	let primaryDisplaySingle = {
                    	    label:this.primaryDisplayData[i].label,
                    	    value:this.primaryDisplayData[i].id
                    	}
                    	this.primaryFilterList.push(primaryDisplaySingle);
                    }
                    //console.log(this.primaryFilterList);
                    this.getDisplay();
                }
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取上架一级分类失败！");
            });
    	},
    	addPrimaryDisplay(){
    		this.$refs['primaryDisplayValidate'].validate((valid) => {
                if (valid) {
                	this.primaryDisplayShow=true;
                	axios({
		                method:'post',
		                url:baseUrl + '/skuConf/addPrimaryDisplay',
		                params:{
		                    label:this.primaryDisplay.label,
		                    createId:getCookie('userId')
		                },
		                responseType:'json'
		            }).then(res=> {
		                //console.log(res)
		                if(res.data.result == -2){
		                    console.log(res);
		                    this.error("新增上架一级类别失败！");
		                }else{
		                    this.getPrimaryDisplay();
		                    this.primaryDisplay.label = '';
		                    this.$Message.success('保存成功!');
		                }
		                this.primaryDisplayShow=false;
		            })
		            .catch(res=> {
		                console.log(res);
		                this.error("新增上架一级类别失败！");
		                this.primaryDisplayShow=false;
		            });
                }
            })
    	},
    	getClassType(){
    		axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:"classType"
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取课程类型列表失败！");
                }else{
                    this.classTypeData = res.data;
                }
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取课程类型列表失败！");
            });
    	},
    	addClassType(){
    		this.$refs['classTypeValidate'].validate((valid) => {
                if (valid) {
                	this.classShow=true;
	                axios({
		                method:'post',
		                url:baseUrl + '/chooseOption/insertAndUpdateOption',
		                params:{
		                    optionKey:this.classType.optionKey,
		            		optionValue:this.classType.optionValue,
		            		description:this.classType.description,
		            		categoryCode:'classType',
		            		categoryName:'课程类型'
		                },
		                responseType:'json'
		            }).then(res=> {
		                //console.log(res)
		                if(res.data.result == -2){
		                    console.log(res);
		                    this.error("新增课程类型失败！");
		                }else{
		                    this.getClassType();
		                    this.$Message.success('保存成功!');
		                    this.classType.optionKey = '';
		                    this.classType.optionValue = '';
		            		this.classType.description = '';
		                }
		                this.classShow=false;
		            })
		            .catch(res=> {
		                console.log(res);
		                this.error("新增课程类型失败！");
		                this.classShow=false;
		            });
                }
            })
    		
    	},
    	getProductType(){
            axios({
                method:'get',
                url:baseUrl + '/product/findAllProductType',
                params:{
                    pageSize:1000,
                    currentPage:1
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res)
                if(res.data.result == -2){
                    console.log(res);
                    this.error("请求失败,获取商品类型错误！");
              }else{
                    //this.productTypeData = res.data;
                    this.productTypeData = res.data.list;
              }
              })
              .catch(res=> {
                  console.log(res);
                  this.error("请求失败,获取商品类型错误！");
              });
             
    	},
		addProductType(){
			this.$refs['productTypeValidate'].validate((valid) => {
                if (valid) {
                	this.typeShow = true;
                    //增加商品类型
		            axios({
		                method:'post',
		                url:baseUrl + '/product/insertProudctType',
		                params:{
		                    name:this.productType.name,
		                    description:this.productType.description,
		                    userId:getCookie('userId'),
		                    type:1
		                },
		                responseType:'json'
		            }).then(res=> {
		                //console.log(res)
		                if(res.data.result == -2){
		                    console.log(res);
		                    this.error("新增商品类型失败！");
		                }else{
		                    this.getProductType();
		                    this.$Message.success('保存成功!');
		                    this.productType.name ='';
		                    this.productType.description = '';
		                }
		                this.typeShow = false;
		            })
		            .catch(res=> {
		                console.log(res);
		                this.typeShow = false;
		                this.error("新增商品类型失败！");
		            });
                }else{
                	this.$Message.error('填写有误!');
                    return false;
                }
            })
		}
    }
};

</script>