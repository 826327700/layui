;let common={
    //判断ie版本
    IEVersion:()=> {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return 7;
            } else if(fIEVersion == 8) {
                return 8;
            } else if(fIEVersion == 9) {
                return 9;
            } else if(fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }   
        } else if(isEdge) {
            return 'edge';//edge
        } else if(isIE11) {
            return 11; //IE11  
        }else{
            return -1;//不是ie浏览器
        }
    },
    //低版本浏览器提示
    checkBrowser:()=>{
        let browser=common.IEVersion()
        if(!isNaN(browser)&&browser>4&&browser<=9){
            layui.use(['jquery'],()=>{
                let $ = layui.$
                let tip=$('<div class="browser-tip">您当前的浏览器版本过低，为了更好的体验，请<a target="_blank" href="http://rj.baidu.com/soft/detail/14744.html?ald">下载我们推荐的浏览器</a>。<i class="layui-icon">&#x1007;</i></div>')
                tip.find('i').click(function(){
                    tip.remove()
                })
                $('body').prepend(tip)
            })
            
        }
    },
    //控制左侧菜单收起展开
    collapseLeft:()=>{
        layui.use(['jquery','layer'],()=>{
            let $ = layui.$
            let collapseButton=$('#collapse-button')
            let leftWrap=$('.left-wrap')
            collapseButton.click(function(){
                if(leftWrap.hasClass('shrink')){
                    leftWrap.removeClass('shrink')
                    collapseButton.find('i').html('&#xe65a;')
                }else{
                    leftWrap.addClass('shrink')
                    collapseButton.find('i').html('&#xe65b;')
                }
            })
            
            let layer = layui.layer;
            $('.left-wrap .layui-nav-item').hover(function(){
                if(leftWrap.hasClass('shrink')){
                    let text=$(this).text()
                    layer.tips(text, this)
                }
            },function(){
                layer.close(layer.index)
            })
        });
    },
    //预先引入常用模块
    importModule:()=>{
        let modules=['jquery','element','form']
        layui.use(modules,()=>{

        })
    }
}
common.importModule()
common.collapseLeft()
common.checkBrowser()