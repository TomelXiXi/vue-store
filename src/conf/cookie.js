//JS操作cookies方法!

//写cookies
export const setCookie = (c_name,value,expiredays) =>
{
    const exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";
}

//读取cookies
export const getCookie = (name) =>
{
    let arr;
    const reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg)){
        return (arr[2]);
    }else{
        return null;
    }
}

//删除cookies
export const removeCookie = (name) =>
{
    const exp = new Date();
    exp.setTime(exp.getTime() - 10000);
    const cval=getCookie(name);
    if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/";
    }
}

// 使用示例
//setCookie('username','Darren',30)
//alert(getCookie("username"));
