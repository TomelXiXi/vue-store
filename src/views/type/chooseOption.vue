 <style lang="less">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}
    @import "../../styles/common.less";
</style>

<template>
	<div>
		<Row span="24">
			<Col span="24" class="padding-right-4">
				<Card>
					<loading v-bind:spinShow='optionShow'></loading>
					<p slot="title">
                        <Icon type="ios-list"></Icon>
                        系统属性
                    </p>
                    <Row class="margin-bottom-10">
                    	<Col span="6">
                    		<Select v-model="optionType" placeholder="选择二级分类" @on-change="optionTypeChange">
	                            <Option v-for="item in optionTypeList2" :value="item.value" :key="item.value">{{ item.label }}</Option> 
	                        </Select>
                    	</Col>
                    </Row>
                    <Row>
                    	<Col span="12">
							<type-table :tableData="chooseOptionList" :tableColumns="chooseOptionColumns"
						height="281"></type-table>
						</Col>
						<Col span="11" offset="1"  style="margin-top: 20px">
							<Form  ref="chooseOptionValidate" label-position="left" :model="chooseOption" 
						:rules="chooseOptionValidate" :label-width="80" >
								<Row class="margin-top-20">
									<Col  span="15">
										<FormItem prop="optionKey" label="key值" >
			                                <Input v-model="chooseOption.optionKey" placeholder="请填写key值..." v-if="id == ''"></Input>
											<Input v-model="chooseOption.optionKey" placeholder="请填写key值..." disabled v-if="id != ''"></Input>
			                            </FormItem>
									</Col>
		                        </Row>
								<Row >
									<Col  span="15">
										<FormItem prop="optionValue" label="名称" >
			                                <Input v-model="chooseOption.optionValue" placeholder="请填写名称..." ></Input>
			                            </FormItem>
									</Col>
		                        </Row>
		                        <Row>
									<Col  span="15">
										<FormItem prop="description" label="描述" >
			                                <Input v-model="chooseOption.description" placeholder="请填写描述..." ></Input>
			                            </FormItem>
									</Col>
		                        </Row>
								<Row type="flex" justify="end" style="margin-top: 70px">
									<!-- <transition name="fade">
										<Col class="margin-right-10"  v-if="id == ''">
											<Button type="primary" @click="addChooseOption('chooseOptionValidate')" >确认新增</Button>
										</Col>
									</transition>
									<transition name="fade">
											<Col class="margin-right-10"  v-if="id != ''">
											<Button type="primary" @click="addChooseOption('chooseOptionValidate')" >确认修改</Button>
											<Button @click="returnAdd" >返回新增</Button>
										</Col>
									</transition> -->
									<Col class="margin-right-10"  v-if="id == ''">
										<Button type="primary" @click="addChooseOption('chooseOptionValidate')" >确认新增</Button>
									</Col>
										<Col class="margin-right-10"  v-if="id != ''">
										<Button type="primary" @click="addChooseOption('chooseOptionValidate')" >确认修改</Button>
										<Button @click="returnAdd" >返回新增</Button>
									</Col>
								</Row>
		                    </Form>
						</Col>
					</Row>
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
import {optionTypeList} from './optionType.js'
export default {
    components: {
        typeTable,loading
    },
    data () {
        return {
        	id:'',
        	optionType:'channels',
        	optionTypeList2:[],
        	chooseOptionList:[],
        	//商品类型
        	optionShow:false,
            chooseOption:{
				optionKey:'',
            	optionValue:'',
            	description:'',
            },
            chooseOptionValidate:{
				optionKey:[
					{ required: true, message: 'key值不能为空', trigger: 'blur' }
				],
            	optionValue:[
            		{ required: true, message: '类型名称不能为空', trigger: 'blur' }
            	],
            	description:[
            		{ required: true, message: '描述不能为空', trigger: 'blur' }
            	]
            },
            chooseOptionColumns:[
                {
                    type: 'index',
                    title: '序号',
                    width:80,
				},
				{
                    title: 'key值',
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
                {
                    title:'操作',
                    align: 'center',
                    width:80,
                    render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
											this.id=params.row.id;
											this.chooseOption.optionKey=params.row.optionKey;
                                            this.chooseOption.optionValue=params.row.optionValue;
											this.chooseOption.description=params.row.description;
											this.$refs['chooseOptionValidate'].validate();
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                }
            ],
        };
    },
    computed: {
        
    },
    created(){
    	this.optionTypeList2 = optionTypeList;
    	this.init();
    },
    methods:{
    	optionTypeChange(){
    		this.init();
    	},
    	error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
    	init(){
    		this.getChooseOption();
    	},
    	returnAdd(){
			this.id='';
			this.chooseOption.optionKey='';
    		this.chooseOption.optionValue='';
			this.chooseOption.description='';
    	},
    	getChooseOption(){
    		axios({
                method:'get',
                url:baseUrl + '/chooseOption/findChooseOptionByCodeAvailable',
                params:{
                    categoryCode:this.optionType
                },
                responseType:'json'
            }).then(res=> {
            	//console.log(res)
              	this.chooseOptionList = res.data;
            })
            .catch(res=> {
                console.log(res);
                this.error("请求失败,获取数据失败！");
            });
    	},
    	addChooseOption(name){
    		this.$refs[name].validate((valid) => {
                if (valid) {
                	this.optionShow=true;
                	let data = {
                		id:this.id,
                		categoryCode:'',
						categoryName:'',
						optionKey:this.chooseOption.optionKey,
                		optionValue:this.chooseOption.optionValue,
                		description:this.chooseOption.description,
                		isAvailable:1
                	}
                	for(let i = 0 ; i < this.optionTypeList2.length ; i++){
                		if(this.optionTypeList2[i].value == this.optionType){
                			data.categoryCode = this.optionTypeList2[i].value;
                			data.categoryName = this.optionTypeList2[i].label;
                		}
                	}
                	axios({
		                method:'post',
		                url:baseUrl + '/chooseOption/insertAndUpdateOption',
		                responseType:'json',
		                params:data,
		            }).then(res=> {
		                console.log(res)
		                if(res.data.status == 1){
							this.$Message.success('保存成功!');
							this.id='';
							this.chooseOption.optionKey = '';
		                    this.chooseOption.optionValue = '';
		                    this.chooseOption.description = '';
		                    this.init();
		                }else{
		                    console.log(res);
		                    this.error(res.data.msg);
		                }
		                this.optionShow=false;
		            })
		            .catch(res=> {
		                console.log(res);
		                this.error("保存失败！");
		                this.optionShow=false;
		            });
                }else{
                	this.$Message.error('填写有误！')
                }
            })
    		
    	},
    }
};

</script>