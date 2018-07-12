<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <div>
        <Modal ref="modal"
            v-model="modal"
            v-bind:title='modalTitle'
            width=70%
            loading="loading"
            @on-ok="ok"
            @on-cancel="cancel"
            :transfer="false">      
           <skuSelect  @showModal="showModal()" @hideModal="hideModal()"
            :selectSkuList="selectSkuList" :isMutilple="isMutilple"></skuSelect>
        </Modal>
        <Modal ref="ComboModal"
            v-model="ComboModal"
            v-bind:title='comboModalTitle'
            width=70%
            loading="loading"
            @on-ok="comboOk"
            @on-cancel="comboCancel"
            :transfer="false">      
           <comboSkuSelect @showComboModal="showComboModal()" @hideComboModal="hideComboModal()"
            :comboSku="comboSku" :isMutilple="isMutilple" :comboSkuList="comboSkuList"></comboSkuSelect>
        </Modal>
    	<Row>
            <Col span="24" >
                <Card v-if="skuConfId == 0">
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        上下架商品列表
                    </p>
                    <Row>
                        <Col>
                        是否组合商品：<i-switch v-model="isCombo" @on-change="changeIsCombo"></i-switch>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Button type="dashed" size="large" @click="selectSku" v-if="isCombo == false">点击选取sku</Button>
                        <Button type="dashed" size="large" @click="selectComboSku" v-if="isCombo == true">点击选取组合商品</Button>
                    </Row>
                </Card>
                <Card v-if="skuConfId != 0 && $route.query.isCopy == 0">
                    <p slot="title" >
                        <Icon type="ios-list"></Icon>
                        修改上架商品信息
                    </p>
                    <Row>
                        <Alert show-icon>
                            修改商品
                            <template slot="desc">当前为修改上架商品页面，请仔细核对修改内容！ </template>
                        </Alert>
                    </Row>
                </Card>
                <Card v-if="skuConfId != 0 && $route.query.isCopy == 1">
                    <p slot="title" >
                        <Icon type="ios-list"></Icon>
                        复制上架商品
                    </p>
                    <Row>
                        <Alert show-icon>
                            复制商品
                            <template slot="desc">当前为复制商品页面,修改前请确认，请勿重复上架！ </template>
                        </Alert>
                    </Row>
                </Card>
                <Card  v-if="selectSkuList.length > 0" class="margin-top-8">
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        基础sku信息
                    </p>
                    <Row >
                        <Col span="6">
                            <p class="common-font">名称：{{selectSkuList[0].name}}</p>
                        </Col>
                        <Col span="6">
                            <p class="common-font">价格：{{selectSkuList[0].price}}</p>
                        </Col>
                        <Col span="6">
                            <p class="common-font">是否虚拟商品：<i-switch v-model="selectSkuList[0].isVirtua" disabled></i-switch></p>
                        </Col>
                        <Col span="6">
                            <p class="common-font">是否组合商品：<i-switch v-model="isCombo" disabled></i-switch></p>
                        </Col>
                        
                        <!-- <Col span="6">
                            <p class="common-font">外部编码：{{selectSkuList[0].extCode1}}</p>
                        </Col> -->
                    </Row>
                </Card>
                <Card  v-if="comboSku.comboCode != ''" class="margin-top-8" >
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        组合商品基础信息
                    </p>
                    <Row >
                        <Col span="6">
                            <p class="common-font">名称：{{comboSku.name}}</p>
                        </Col>
                        <Col span="6">
                            <p class="common-font">价格：{{comboSku.price}}</p>
                        </Col>
                        <Col span="6">
                            <p class="common-font">是否虚拟商品：<i-switch v-model="isCombo" disabled></i-switch></p>
                        </Col>
                        <!-- <Col span="6">
                            <p class="common-font">外部编码：{{comboSku.comboCode}}</p>
                        </Col> -->
                    </Row>
                </Card>
                <Form ref="skuConfValidate" label-position="left" :model="skuConf" :rules="skuConfAddRequestDetailValidate" :label-width="130">
                    <Card  v-if="comboSku.comboCode != '' || selectSkuList.length > 0" class="margin-top-8">
                        <p slot="title">
                            <Icon type="ios-list"></Icon>
                            配置信息详情   
                        </p>
                        <Row>
                            <Row type="flex"  align="middle">
                                <Col span="8">                  
                                    <FormItem prop="name" label="上架名称" >
                                        <Input v-model="skuConf.name" placeholder="请填写商品上架名称..." ></Input>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8">  
                                    <FormItem prop="quantity" label="库存数量" >
                                        <Input v-model="skuConf.quantity" placeholder="请输入库存数量..." ></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle">
                                <Col span="8">  
                                    <FormItem prop="price" label="售价" >
                                        <Input v-model="skuConf.price" placeholder="请输入售价..." ></Input>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8">  
                                    <FormItem prop="vipPrice" label="会员价">
                                        <Input v-model="skuConf.vipPrice" placeholder="请输入会员价..." ></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle">
                                <!-- <Col span="8">  
                                    <FormItem prop="isOnSale" label="是否上架" >
                                        <i-switch v-model="skuConf.isOnSale" @on-change="isOnSaleChange"></i-switch>
                                    </FormItem>
                                </Col> -->
                                <Col span="8">  
                                    <FormItem prop="isOnSale" label="是否上架" >
                                        <i-switch v-model="skuConf.isOnSale" ></i-switch>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8">  
                                    <FormItem prop="isUseCoupon" label="能否使用优惠券">
                                        <i-switch v-model="skuConf.isUseCoupon"></i-switch>
                                    </FormItem>
                                </Col>
                            </Row>
<!--                             <Row class="margin-top-8" type="flex"  align="middle" v-if="skuConf.isOnSale != true">
                                <Col span="8">  
                                    <FormItem prop="isAutoUp" label="自动上架" >
                                        <i-switch v-model="skuConf.isAutoUp"></i-switch>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8" v-if="skuConf.isAutoUp == true">  
                                    <FormItem prop="autoUpTime" label="自动上架时间">
                                         <DatePicker type="datetime" placeholder="选择上架时间..."
                                            style="width: 200px" @on-change="autoUpTimeChange"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle" v-if="skuConf.isOnSale == true">
                                <Col span="8">  
                                    <FormItem prop="isAutoDown" label="自动下架" >
                                        <i-switch v-model="skuConf.isAutoDown"></i-switch>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8" v-if="skuConf.isAutoDown == true">  
                                    <FormItem prop="autoDownTime" label="自动下架时间">
                                         <DatePicker type="datetime" placeholder="选择下架时间..."
                                            style="width: 200px" @on-change="autoDownTimeChange"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row> -->
                            <Row class="margin-top-8" type="flex"  align="middle" v-if="skuConf.isOnSale == true">
                                <Col span="8" >  
                                    <FormItem prop="autoUpTime" label="自动上架时间">
                                         <DatePicker type="datetime" placeholder="选择上架时间..." v-model="skuConf.autoUpTime"
                                            style="width: 200px" @on-change="autoUpTimeChange"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8">  
                                    <FormItem prop="autoDownTime" label="自动下架时间">
                                         <DatePicker type="datetime" placeholder="选择下架时间..." v-model="skuConf.autoDownTime"
                                            style="width: 200px" @on-change="autoDownTimeChange"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle" >
                                <Col span="8">  
                                    <FormItem prop="discount" label="折扣" >
                                        <Input v-model="skuConf.discount" placeholder="请输入折扣,例：九折、三五折..." ></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle" >
                                <Col span="8" >  
                                    <FormItem prop="remark" label="商品短描述" >
                                        <Input v-model="skuConf.remark" placeholder="请输入商品短描述..." ></Input>
                                    </FormItem>
                                </Col>
                                <Col span="8" offset="4">  
                                    <FormItem prop="remark2" label="商品长描述" >
                                        <Input v-model="skuConf.remark2" placeholder="请输入商品长描述..." ></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle" >
                                <Col span="8">  
                                    <FormItem prop="isNeedAddress" label="是否需要地址" >
                                        <i-switch v-model="skuConf.isNeedAddress"></i-switch>
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8">  
                                    <FormItem prop="isAddCart" label="能否加入购物车" >
                                        <i-switch v-model="skuConf.isAddCart"></i-switch>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-8" type="flex"  align="middle">
                                <Col span="8">  
                                    <FormItem prop="primaryDisplayId" label="一级类别">
                                        <Select v-model="skuConf.primaryDisplayId" @on-change="primaryChange">
                                            <Option v-for="item in primaryList" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                                        </Select> 
                                    </FormItem>
                                </Col>
                                <Col offset="4" span="8">  
                                    <FormItem prop="displayTypeId" label="二级类别">
                                         <Select v-model="skuConf.displayTypeId">
                                            <Option v-for="item in displayTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                                        </Select> 
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                    </Card>

                    <Card class="margin-top-8" v-if="comboSku.comboCode != '' || selectSkuList.length > 0">
                        <p slot="title">
                            <Icon type="ios-list"></Icon>
                            图片上传   
                        </p>
                        <Row class="margin-top-8" type="flex"  align="middle" >
                            <Col span="5"> 
                                <FormItem prop="displayUrl" label="封面图片">
                                    <Upload name="fileField" 
                                            :action='uploadUrl'
                                            :on-success="displayUrlSuccess"
                                            :on-error="displayUrlError"
                                            :show-upload-list="false">
                                        <Button type="ghost" icon="ios-cloud-upload-outline" long>上传封面图片</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col span="2">
                                <img :src="skuConf.displayUrl" style="width:auto;height:80px">
                            </Col>
                            <Col offset="5" span="5" >
                                <FormItem prop="detailUrl" label="主图">
                                    <Upload name="fileField" 
                                            :action='uploadUrl'
                                            :on-success="detailUrlSuccess"
                                            :on-error="detailUrlError"
                                            :show-upload-list="false">
                                        <Button type="ghost" icon="ios-cloud-upload-outline" long>上传主图</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col>
                                <img :src="skuConf.detailUrl" style="width:auto;height:80px">
                            </Col>
                        </Row>
                        <Row class="margin-top-8" type="flex"  align="middle" >
                            <Col span="5">  
                                <FormItem prop="verticalUrl" label="竖屏图">
                                    <Upload name="fileField" 
                                            :action='uploadUrl'
                                            :on-success="verticalUrlSuccess"
                                            :on-error="verticalUrlError"
                                            :show-upload-list="false">
                                        <Button type="ghost" icon="ios-cloud-upload-outline" long>上传竖屏</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col  span="2">
                                <img :src="skuConf.verticalUrl" style="width:auto;height:80px">
                            </Col>
                            <Col offset="5" span="5" >  
                                <FormItem prop="horizontalUrl" label="横屏图">
                                    <Upload name="fileField" 
                                            :action='uploadUrl'
                                            :on-success="horizontalUrlSuccess"
                                            :on-error="horizontalUrlError"
                                            :show-upload-list="false">
                                        <Button type="ghost" icon="ios-cloud-upload-outline" long>上传横屏图</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col>
                                <img :src="skuConf.horizontalUrl" style="width:auto;height:80px">
                            </Col>
                        </Row>
                    </Card>
                    </Form>

                    <Form ref="pointsValidate" label-position="left" :model="points" :rules="skuConfAddRequestDetailValidate" :label-width="130"> 
                    <Card class="margin-top-8">
                        <p slot="title">
                            <Icon type="ios-list"></Icon>
                            积分基础配置信息  
                        </p>
                        <Row class="margin-top-8" type="flex"  align="middle" >
                            <Col span="3">
                                <p class="common-font">默认返还比例：{{cashReturnRate}}</p>
                            </Col>
                            <Col span="5" offset="1" class="margin-top-8">
                                <Alert type="success" show-icon>付款100元可返{{100*cashReturnRate}}元，即{{100*cashReturnRate*cashToPointsRate}}积分</Alert>
                            </Col>
                            <Col span="4" offset="3">
                                <p class="common-font">现金-积分兑换比例：{{cashToPointsRate}}</p>
                            </Col>
                            <Col span="4" offset="1" class="margin-top-8">
                                <Alert type="success" show-icon>1元可兑换{{1*cashToPointsRate}}积分</Alert>
                            </Col>
                        </Row>
                    </Card>

                    <Row>
                        <Col span="12" >
                            <Card  v-if="comboSku.comboCode != '' || selectSkuList.length > 0" class="margin-top-8">
                                <p slot="title">
                                    <Icon type="ios-list"></Icon>
                                    积分抵现配置   
                                </p>
                                <Row>
                                    <Col span="12">
                                        <FormItem prop="isUsePoints" label="能否使用积分" >
                                            <i-switch v-model="points.isUsePoints"></i-switch>
                                        </FormItem>
                                    </Col>
                                    <Col v-if="points.isUsePoints == true" span="12">
                                        <FormItem prop="isPointsAdjust" label="积分是否可调" >
                                            <i-switch v-model="points.isPointsAdjust"></i-switch>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col v-if="points.isUsePoints == true" span="10">
                                        <FormItem prop="maxUsePoints" label="最大使用数量" >
                                             <Input v-model="points.maxUsePoints" placeholder="请输入积分最大使用数量..." ></Input>
                                        </FormItem>
                                    </Col>
                                    <Col v-if="points.isUsePoints == true" span="10" offset="2" class="margin-bottom-12">
                                        <Alert show-icon>相当于{{points.maxUsePoints/cashToPointsRate}}元</Alert>
                                    </Col>
     <!--                                <Col v-if="points.isUsePoints == true & points.isPointsAdjust != true"  span="10">
                                        <FormItem prop="maxUsePoints" label="积分使用数量" >
                                             <Input v-model="points.vipPirce" placeholder="请输入积分使用数量..." ></Input>
                                        </FormItem>
                                    </Col> -->
                                </Row>
                            </Card>
                        </Col>
                        <Col span="12" class="padding-left-4">
                            <Card  v-if="comboSku.comboCode != '' || selectSkuList.length > 0" class="margin-top-8">
                                <p slot="title">
                                    <Icon type="ios-list"></Icon>
                                    积分返还配置   
                                </p>
                                <Row>
                                    <Row type="flex"  align="middle">
                                        <Col span="10">                  
                                            <FormItem prop="isReturnPoints" label="能否返还积分" >
                                                <i-switch v-model="points.isReturnPoints"></i-switch>
                                            </FormItem>
                                        </Col>
                                        <Col offset="2" span="10">  
                                            <FormItem prop="returnRateOrQuantity" label="是否返固定积分" v-if="points.isReturnPoints == true">
                                                <i-switch v-model="points.returnRateOrQuantity"></i-switch>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row type="flex"  align="middle" >
                                        <Col span="10" v-if="points.isReturnPoints == true && points.returnRateOrQuantity == true">  
                                            <FormItem prop="returnQuantity" label="返还积分数量" >
                                                <Input v-model="points.returnQuantity" placeholder="请输入返还积分数量..." ></Input>
                                            </FormItem>
                                        </Col>
                                        <Col v-if="points.isReturnPoints == true && points.returnRateOrQuantity == true"
                                             span="10" offset="2" class="margin-bottom-12">
                                            <Alert show-icon>相当于{{points.returnQuantity/cashToPointsRate}}元</Alert>
                                        </Col>

                                    </Row>
                                    <Row type="flex"  align="middle" v-if="points.isReturnPoints == true && points.returnRateOrQuantity == false">
                                        <Col span="10">                  
                                            <FormItem prop="isSpecRate" label="特定返还比例" >
                                                <i-switch v-model="points.isSpecRate"></i-switch>
                                            </FormItem>
                                        </Col>
                                        <Col offset="2" span="10" v-if="points.isReturnPoints == true && 
                                            points.returnRateOrQuantity == false && points.isSpecRate == true"> 
                                            <FormItem prop="returnRate" label="特定比例" >
                                                <Input v-model="points.returnRate" placeholder="请输入特定返还比例..." ></Input>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                   <!--  <Row type="flex"  align="middle" v-if="points.isReturnPoints == true && points.returnRateOrQuantity == 0">
                                        <Col span="10">                  
                                            <FormItem prop="maxReturnPoints" label="最多返还数量" >
                                                <Input v-model="points.maxReturnPoints" placeholder="请输入最多返还数量..." ></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="10" offset="2" class="margin-bottom-12">
                                            <Alert show-icon>相当于{{points.maxReturnPoints/cashToPointsRate}}元</Alert>
                                        </Col>
                                    </Row> -->
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Card class="margin-top-8" v-if="comboSku.comboCode != '' || selectSkuList.length > 0">
                        <p slot="title">
                            <Icon type="ios-list"></Icon>
                            特殊活动   
                        </p>
                        <Row class="margin-top-8" type="flex"  align="middle" >
                            <Col span="8">  
                                <FormItem prop="isSpec" label="特殊活动商品" >
                                    <i-switch v-model="isSpec"></i-switch>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="isSpec == true">
                            <Col span="8">
                                <FormItem prop="popupId" label="配置信息">
                                    <Select v-model="skuConf.popupId" >
                                        <Option v-for="item in popupList" :value="item.id" :key="item.id">{{ item.remark }}</Option> 
                                    </Select> 
                                </FormItem>
                            </Col>
                        </Row>
                        <Row class="margin-top-8" type="flex"  align="middle" justify="end">

                            <Button type="primary" @click="addSkuConf('skuConfValidate','pointsValidate')" v-if="skuConfId == 0">确认上架</Button>
                            <Button type="primary" @click="addSkuConf('skuConfValidate','pointsValidate')" v-if="skuConfId != 0">确认修改</Button>
                            <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
                        </Row>
                    </Card>
                </Form>
            </Col>
        </Row>
        <loading v-bind:spinShow='spinShow'></loading>
    </div>
</template>

<script>
import axios from 'axios'
import {baseUrl} from '../../conf/env'
import loading from '../loading/loading'
import skuSelect from '@/views/product/sku/sku-select.vue'
import comboSkuSelect from '@/views/product/comboSku/comboSku-select.vue'
import {discountList} from './discount.js'
import {setCookie, getCookie, removeCookie} from '@/conf/cookie'
import $ from 'jquery'
export default {
    components:{
        loading,skuSelect,comboSkuSelect
    },
    data () {
        const quantityValite  = (rule, value, callback) => {
            if (!value) {
                callback(new Error('库存数量不能为空'));
            }
            let reg = /^[+]{0,1}(\d+)$/;
            if(!reg.test(value)){
                callback(new Error('库存数量必须为正整数！'));
            }else{
                callback();
            }          
        };
        const priceValite  = (rule, value, callback) => {
            if (!value) {
                callback(new Error('价格不能为空'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确金额'));
            } else{
                callback();
            }
        };
        const vipPriceValite  = (rule, value, callback) => {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (reg.test(value) || !value) {
                callback();
            } else{
                callback(new Error('请输入正确金额'));
            }
        };
        const selectValite2  = (rule, value, callback) => {

            if (value != 0 & value != 1) {
                callback(new Error('此项必选'));
            }else{
                callback();
            }
        };
        const selectValite  = (rule, value, callback) => {
            //console.log(value)
            if (!value) {
                callback(new Error('此项必选'));
            }else{
                callback();
            }
        };
        const primaryDisplayIdValite= (rule, value, callback) => {
            if (!value) {
                callback(new Error('一级类别为必选'));
            }else{
                callback();
            }
        };
        const displayTypeIdValite  = (rule, value, callback) => {
            //console.log(value)
            //console.log(this.skuConf.displayTypeId)
            if (!value) {
                callback(new Error('二级类别为必选'));
            }else{
                callback();
            }
        };
/*        const autoUpTimeValite  = (rule, value, callback) => {
            if (this.skuConf.isAutoUp == 1) {
                if(!value){
                    callback(new Error('自动上架时间不能为空'));
                }else{
                    callback();
                }
            }else{
                callback();
            }
        };
        const autoDownTimeValite  = (rule, value, callback) => {
            if (this.skuConf.isAutoDown == 1) {
                if(!value){
                    callback(new Error('自动下架时间不能为空'));
                }else{
                    callback();
                }
            }else{
                callback();
            }
        };*/
        const displayUrlValite =  (rule, value, callback) => {
            if(this.skuConf.displayUrl == ''){
                callback(new Error('封面图片不能为空!'));
            }
            callback();
        };
        const maxUsePointsValite = (rule, value, callback) => {
             let reg = /^\+?[1-9][0-9]*$/;
             if(!reg.test(value)){
                callback(new Error('需填可被' + this.cashToPointsRate +'整除的正整数'));
             }else{
                if(value % this.cashToPointsRate == 0){
                    if(this.skuConf.price < value/this.cashToPointsRate){
                        callback(new Error('抵用积分总金额不能大于商品价格'))
                    }else{
                        callback();
                    }
                    
                }else{
                    callback(new Error('需填可被' + this.cashToPointsRate +'整除的正整数'));
                }
             }
        };
        const returnQuantityValite = (rule, value, callback) => {
            //console.log(value);
            if(!value || value == 0){
                callback(new Error('返还数量不能为空'));
            }
            let reg = /^\+?[1-9][0-9]*$/;
            if(!reg.test(value) || value % this.cashToPointsRate != 0){
                callback(new Error('需填可被' + this.cashToPointsRate +'整除的正整数'));
             }else{
                if(this.skuConf.price < value/this.cashToPointsRate){
                    callback(new Error('返还积分总金额不能大于商品价格'))
                }else{
                    callback();
                }
             }
        };
        const returnRateValite = (rule, value, callback) => {
            //console.log(value);
            if(!value || value == 0){
                callback(new Error('特定比例不能为空'));
            }
            let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(!reg.test(value) || value >1 ){
                callback(new Error('必须为不大于1的两位小数'));
            }
            callback();
        };
        const maxReturnPointsValite = (rule, value, callback) => {
            //console.log(value);
            if(!value || value == 0){
                callback(new Error('返还数量不能为空'));
            }
            let reg = /^\+?[1-9][0-9]*$/;
            if(!reg.test(value) || value % this.cashToPointsRate != 0){
                callback(new Error('需填可被' + this.cashToPointsRate +'整除的正整数'));
             }else{
                callback();
             }
        }
        return {
            popupList:[],
            primaryList:[],
            displayTypeListAll:[],
            displayTypeList:[],
            spinShow:true,
            skuConfId:0,
            cashReturnRate:0,
            cashToPointsRate:0,
            returnRateOrQuantityList:[
                {value:0,label:"按比例返还"},
                {value:1,label:"按固定数量返还"},
            ],
            uploadUrl:baseUrl + "/fileController/uploadFile",
            isSpec:false,
            discountList1:[],
            ComboModal:false,
            comboModalTitle:'选取组合商品',
            isMutilple:0,
            isCombo:false,
            selectSkuList:[],
            modal:false,
            modalTitle:'选取sku',
            comboSku:{
                comboCode:'',
                name:'',
                price:''
            },
            comboSkuList:[],
            skuConf:{
                id:null,
                isCombo:true,
                code:'',
                name:'',
                quantity:'',
                price:'',
                vipPrice:'',
                isUseCoupon:true,
                isOnSale:true,
                autoUpTime:null,
                autoDownTime:null,
                isAutoUp:false,
                isAutoDown:false,
                discount:'',
                primaryDisplayId:'',
                displayTypeId:'',
                displayUrl:'',
                detailUrl:'',
                verticalUrl:'',
                horizontalUrl:'',
                popupId:1,
                isNeedAddress:true,
                isAddCart:false,
                createId:'',
                updateId:''
            },
            points:{
                id:null,
                isCombo:true,
                code:'',
                isUsePoints:false,
                isPointsAdjust:true,
                maxUsePoints:0,
                isReturnPoints:false,
                returnRateOrQuantity:false,
                isSpecRate:false,
                returnQuantity:0,
                returnRate:0.01,
                maxReturnPoints:0,
                createId:'',
                updateId:''
            },
            popup:{
                startTime:null,
                endTime:null,
                channelId:1,
                addressesId:1,
                versionsId:1,
                appNamesId:1,
                deviceTypesId:1,
                openMode:1,
                popupIndex:1,
                timeLimit:1,
                remark:'',
                extCondition1:null,
                extCondition2:null
            },
            skuConfAddRequestDetailValidate:{
                name:[
                    { required: true, message: '上架名称不能为空', trigger: 'blur' }
                ],
                quantity:[
                    { required: true, trigger: 'blur',validator:quantityValite }
                ],
                price:[
                    { required: true, trigger: 'blur',validator:priceValite }
                ],
                vipPrice:[
                    { trigger: 'blur',validator:vipPriceValite }
                ],
/*                isAutoUp:[
                    { required: true, trigger: 'change',validator:selectValite2 }
                ],
                isAutoDown:[
                    { required: true, trigger: 'change',validator:selectValite2 }
                ],*/
/*                autoUpTime:[
                    { required: true, trigger: 'change',validator:autoUpTimeValite }
                ],
                autoDownTime:[
                    { required: true, trigger: 'change',validator:autoDownTimeValite }
                ],*/
                primaryDisplayId:[
                    { required: true, trigger: 'change',validator:primaryDisplayIdValite }
                ],
                displayTypeId:[
                    { required: true, trigger: 'change',validator:displayTypeIdValite }
                ],
                displayUrl:[
                    {required: true, trigger: 'change',validator:displayUrlValite }
                ],
                maxUsePoints:[
                    { trigger: 'blur',validator:maxUsePointsValite }
                ],
                returnQuantity:[
                    { trigger: 'blur',validator:returnQuantityValite }
                ],
                returnRate:[
                    { trigger: 'blur',validator:returnRateValite }
                ],
                maxReturnPoints:[
                    { trigger: 'blur',validator:maxReturnPointsValite }
                ],
                remark:[
                    { trigger: 'blur',required: true, message: '商品描述不能为空' }
                ],
            }
        };
    },
    computed: {
        avatorImage () {
            return localStorage.avatorImgPath;
        }
    },
    created(){
        this.discountList1=discountList;
        this.init();
    },
    methods:{
        primaryChange(value,isInit){
            if(isInit != 1){
               this.skuConf.displayTypeId=''; 
            }
            //console.log(value);
            this.displayTypeList=[];
            for(let i = 0 ; i < this.displayTypeListAll.length ; i ++){
                if(this.displayTypeListAll[i].primaryId == this.skuConf.primaryDisplayId){
                    let displayTypeIdSingle = {
                        value:this.displayTypeListAll[i].id,
                        label:this.displayTypeListAll[i].displayLabel
                    }
                    this.displayTypeList.push(displayTypeIdSingle);
                }
            }
        },
        autoUpTimeChange(date){
            this.skuConf.autoUpTime=date;
            if(date == ''){
                this.skuConf.autoUpTime=null;
            }
        },
        autoDownTimeChange(date){
            this.skuConf.autoDownTime=date;
            if(date == ''){
                this.skuConf.autoDownTime=null;
            }
        },
        addSkuConf(name1,name2){
            this.spinShow = true;
            //console.log(this.skuConf.returnRateOrQuantity);
            let name1Valid = true;
            this.$refs[name1].validate((valid) => {
                if (!valid) {
                    this.$Message.error('填写有误!');
                    name1Valid = false;
                }
            })
            if(name1Valid == true){
                this.$refs[name2].validate((valid) => {
                if (valid) {
                    let remark = this.skuConf.remark;
                    let remark2 = this.skuConf.remark2;
                    console.log(remark);
                    console.log(remark2);
                    if(remark2 != '' && remark2 != undefined){
                        this.skuConf.remark = remark + "|" + remark2
                    }
                    if(this.skuConf.id == null){
                        this.skuConf.isCombo = this.isCombo;
                        this.points.isCombo = this.isCombo;
                        if(this.skuConf.isCombo == true){
                            this.skuConf.code = this.comboSku.comboCode;
                            this.points.code = this.comboSku.comboCode;
                        }else{
                            this.skuConf.code = this.selectSkuList[0].code;
                            this.points.code = this.selectSkuList[0].code;
                        }
                    }
                    if(this.skuConf.id == null){
                        this.skuConf.createId=getCookie('userId');
                        this.points.createId=getCookie('userId');
                    }else{
                        this.skuConf.updateId=getCookie('userId');
                        this.points.updateId=getCookie('userId');
                    }
                    if(this.$route.query.isCopy == 1){
                        this.skuConf.id=null;
                        this.points.id=null;
                    }
                    let data = '';
                    if(this.isSpec == false){
                        data = {
                            skuConf:JSON.stringify(this.skuConf),
                            points:JSON.stringify(this.points)
                        }
                    }else{
                        data = {
                            skuConf:JSON.stringify(this.skuConf),
                            points:JSON.stringify(this.points),
                            popup:JSON.stringify(this.popup)
                        }
                    }
                    //console.log(this.skuConf.code);
                    axios({
                    method:'post',
                    url:baseUrl + '/skuConf/addOrUpdateSkuConf',
                    params:data,
                    responseType:'json'
                    }).then(res=> {
                        console.log(res);
                        if(res.data.status == 1){
                            this.$Message.success('保存成功!');
                            this.$router.push({
                                    name:"skuConf"
                                })
                        }else{
                            this.error("服务器请求失败！");
                        }
                        this.spinShow = false;
                    })
                    .catch(res=> {
                          console.log(res);
                          this.error("服务器请求失败！");
                          this.spinShow = false;
                    });
                }else{
                    this.$Message.error('填写有误!');
                    this.spinShow = false;
                    return false;
                }
            })
            }
            this.spinShow = false;
        },
        error (nodesc) {
            this.$Notice.error({
                title: '错误',
                desc: nodesc 
            });
        },
        init(){
            //首先判断是否带参
            let skuConfId = this.$route.query.skuConfId;
            if(skuConfId != undefined){
                this.skuConfId = skuConfId;
                //获取配置以及积分信息
                axios({
                    method:'post',
                    url:baseUrl + '/skuConf/findSkuConfCommandInfo',
                    params:{
                        skuConfId:this.skuConfId
                    },
                    responseType:'json'
                }).then(res=> {
                    //console.log(res);
                    this.skuConf = res.data.object.skuConf;
                    this.points = res.data.object.points;
                    this.isCombo = res.data.object.skuConf.isCombo;
                    let remark = res.data.object.skuConf.remark;
                    if(remark.indexOf("|") != -1){
                        this.skuConf.remark = remark.substring(0,remark.indexOf("|"));
                        this.skuConf.remark2 = remark.substring(remark.indexOf("|")+1,remark.length);
                    }
                    console.log(res.data.object.skuConf.autoUpTime);
                    if(res.data.object.skuConf.autoUpTime != undefined){
                        this.skuConf.autoUpTime = new Date(res.data.object.skuConf.autoUpTime);
                    }
                    if(res.data.object.skuConf.autoDownTime != undefined){
                        this.skuConf.autoDownTime = new Date(res.data.object.skuConf.autoDownTime);
                    }
                    let popup = res.data.object.skuConf.popupId;
                    if(popup != 1){
                        this.isSpec = true;
                    }
                    //this.selectSkuList.push({id:0});
                    //获取sku基础信息
                    this.getSkuInfo();
                    //获取上架一二级类别
                    this.getType();
                    this.spinShow = false;
                })
                .catch(res=> {
                      console.log(res);
                      this.error("获取上架商品数据失败！");
                      this.spinShow = false;
                });
            }else{
                this.getType();
            }
            //获取积分基础配置信息
             axios({
                method:'get',
                url:baseUrl + '/points/getCashPointsRate',
                responseType:'json'
                })
                .then(res=> {
                    //console.log(res);
                    this.cashReturnRate=res.data.cashReturnRate;
                    this.cashToPointsRate=res.data.cashToPointsRate;
                })
                .catch(res=> {
                    console.log(res);
                    this.error("服务器请求失败！");
                });  
            this.findAllPopup();
            this.spinShow = false;
        },
        //查询配置信息列表
        findAllPopup(){
            axios({
                method:'post',
                url:baseUrl + '/popup/findAllPopup',
                params:{
                    currentPage:1,
                    pageSize:10000,
                    extCondition1:1,
                },
                responseType:'json'
            }).then(res=> {
                console.log(res);
                this.popupList = res.data.list;
            })
            .catch(res=> {
                console.log(res);
                this.error("获取配置信息列表失败！");
            });
        },
        //获取sku基础信息
        getSkuInfo(){
            //this.skuConf.isCombo;
            axios({
                method:'get',
                url:baseUrl + '/product/findByCodeAndIsCombo',
                params:{
                    code:this.skuConf.code,
                    isCombo:this.skuConf.isCombo
                },
                responseType:'json'
            }).then(res=> {
                //console.log(res);
                if(this.skuConf.isCombo == true){
                    this.comboSku.comboCode = res.data.object.comboCode;
                    this.comboSku.name = res.data.object.name;
                    this.comboSku.price = res.data.object.price;
                }else{
                    let selectSkuSingle = {
                        code:res.data.object.code,
                        price:res.data.object.price,
                        skuId:res.data.object.id,
                        name:res.data.object.name,
                        isVirtua:res.data.object.isVirtua,
                        unitPrice:res.data.object.price
                    }
                    this.selectSkuList.push(selectSkuSingle);
                }
            })
            .catch(res=> {
                  console.log(res);
                  this.error("获取sku基础信息失败！");
                  this.spinShow = false;
            });
        },
        getType(){
            //获取一级类别
            axios({
                method:'get',
                url:baseUrl + '/skuConf/findAllPrimaryDisplay',
                responseType:'json'
                }).then(res=> {
                    //console.log(res);
                    for(let i = 0 ; i < res.data.length ; i ++){
                        let primaryListSingle = {
                            value:res.data[i].id,
                            label:res.data[i].label
                        } 
                        this.primaryList.push(primaryListSingle);
                    }
                    //获取二级类型
                    axios({
                        method:'get',
                        url:baseUrl + '/skuConf/findAllDisplay',
                        responseType:'json'
                        }).then(res=> {
                            this.displayTypeListAll = res.data;
                            //console.log(this.skuConf.primaryDisplayId);
                            this.primaryChange(this.skuConf.primaryDisplayId,1);
                        })
                        .catch(res=> {
                              console.log(res);
                              this.error("服务器请求失败！");
                        });
                })
                .catch(res=> {
                      console.log(res);
                      this.error("服务器请求失败！");
                });
        },
        changePageSize(){
            this.pageNum=1;
            this.init();
        },
        changeIsCombo(){
            this.comboSku={
                comboCode:'',
                name:'',
                price:''
            }
            this.selectSkuList=[];
        },
        isOnSaleChange(flag){
            //console.log(flag)
            if(flag == true){
                this.skuConf.isAutoUp = false;
                this.skuConf.isAutoDown = false;
                this.skuConf.autoUpTime = null;
                this.skuConf.autoDownTime = null;
            }
        },
        selectSku(){
            this.comboSku={
                comboCode:'',
                name:'',
                price:''
            }
            this.selectSkuList=[];
            this.modal=true;
        },
        selectComboSku(){
            this.comboSku={
                comboCode:'',
                name:'',
                price:''
            }
            this.selectSkuList=[];
            this.ComboModal=true;
        },
        ok(){
            this.modal=false;
            //console.log(this.selectSkuList);
        },
        cancel(){

        },
        comboOk(){
            this.ComboModal=false;
        },
        comboCancel(){

        },
        showModal(){
            this.modal=true;
        },
        hideModal(){
            this.modal=false;
        },
        showComboModal(){
            this.ComboModal = true;
        },
        hideComboModal(){
            this.ComboModal = false;
        },
        displayUrlSuccess(res,file){
            console.log(res);
            if(res.result == 1){
                this.skuConf.displayUrl = res.url;
                this.$Message.success("上传成功");
            }else{
                this.error("封面图片上传失败！");
            }
        },
        displayUrlError(res,file){
            console.log(res);
            this.error("封面图片上传失败！");
        },
        detailUrlSuccess(res,file){
            console.log(res);
            if(res.result == 1){
                this.skuConf.detailUrl = res.url;
                this.$Message.success("上传成功");
            }else{
                this.error("主图上传失败！");
            }
        },
        detailUrlError(res,file){
            console.log(res);
            this.error("主图上传失败！");
        },
        verticalUrlSuccess(res,file){
            console.log(res);
            if(res.result == 1){
                this.skuConf.verticalUrl = res.url;
                this.$Message.success("上传成功");
            }else{
                this.error("竖屏图片上传失败！");
            }
        },
        verticalUrlError(res,file){
            console.log(res);
            this.error("竖屏图片上传失败！");
        },
        horizontalUrlSuccess(res,file){
            console.log(res);
            if(res.result == 1){
                this.skuConf.horizontalUrl = res.url;
                this.$Message.success("上传成功");
            }else{
                this.error("横屏图片上传失败！");
            }
        },
        horizontalUrlError(res,file){
            console.log(res);
            this.error("横屏图片上传失败！");
        }
    }

};
</script>