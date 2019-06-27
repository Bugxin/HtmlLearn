
var totalDataNum = 0;  // 数据条数
var pageSize = 5;  // 每页展示数据条数


$(function (){

    load();
    showPageNum();

    $('#nav-ul1 li').click(function () {
        $(this).addClass('active').siblings('li').removeClass('active');
    });

    // 弹出发布框
    $('#publish-content').click(function () {
        clearPublish();
        $('#content-publish-div').modal('show');
    });

    //清空发布框内容
    $('#clear-content-form').click(function () {
        clearPublish();
    });

    /*发布内容*/
    $('#publish').click(function(){
        let data=getPageData(1,0);
        console.log(data, 11111);
        let text = $('#content-publish-form textarea').val();
        let content ={'img':'./img/bojie.jpg', 'text':text, 'zanNum':0, 'discussNum':0, 'comment':[]};
        data.push(content);
        localStorage.setItem('content',JSON.stringify(data))
         $('#content-publish-div').modal('hide');
        load();
    });

});

// flag=-1获取当前页的数据, =0获取的是总数据
function getPageData(currentPage=1, flag=-1){
    let collection=localStorage.getItem('content');
    let data = [];
    let index = (currentPage-1)*pageSize;  //索引起始值

	if(collection!=null){
	    if(flag === 0){
	        data = JSON.parse(collection);
        }else {
	        data = JSON.parse(collection).slice(index, index+pageSize);
        }
	    totalDataNum = JSON.parse(collection).length;
	}
	return data;
}

//展示页数
function showPageNum(currentPage=1) {
    let pageNum =  Math.ceil(totalDataNum/pageSize);  //总页数
    $('#page ul').empty();
    for(let i = 0; i < pageNum; i++){
        let j = i +1;
        if (j === currentPage){
          $(`<li class="active"><a href="#" onclick="load(${j})" id="page-${j}">${j}</a></li>`).appendTo($('#page ul'));
        }else {
          $(`<li ><a href="#" onclick="load(${j})" id="page-${j}">${j}</a></li>`).appendTo($('#page ul'));
        }
    }
    $('#page').css('display', 'block');
}


//清空发布框
function clearPublish() {
    $('#content-publish-form')[0].reset();
}


// 发布评论
function sendComment(index, currentPage) {
    let data = $('#content-'+index+' input').val();
    updateData(index,currentPage,'discussNum');
    updateData(index,currentPage,'comment',data);
};

//点赞
function thumbsUp(index, currentPage) {
    updateData(index,currentPage,'zanNum');
};

//获取评论
function getComment(index, currentPage) {
    let totalData=getPageData(currentPage);
    let rawData = totalData.slice(index,index+1)[0];
    console.log(rawData, "getComment");
    if (rawData['comment'].length === 0){
        return [];
    }else {
        return rawData['comment'];
    }

}

//加载数据
function load(currentPage=1) {
    let totalData=getPageData(currentPage);
    $('#content-list').empty();
    for(let i =0; i < totalData.length; i++){
        $('#content-list').append(`<div class="media" id="media${i}">
        <div class="media-body">
            <div class="part1"><a href="#">${totalData[i]['text']}</a></div>
            <div class="part2">
                <button type="submit" class="btn btn-default btn-xs  glyphicon glyphicon-thumbs-up" 
                onclick="thumbsUp(${i}, ${currentPage})" title="点赞">
                </button>
                <span>${totalData[i]['zanNum']}</span>
                <button type="submit" id="comment-${i}" class="btn btn-default btn-xs  glyphicon glyphicon-edit" 
                 title="评论" onclick="showComment(${i},${currentPage})">
                </button>
                <span >${totalData[i]['discussNum']}</span>
            </div>
            <!--评论区域-->
            <div style="display: none; border: 1px solid #b9def0" id ='content-${i}'>
                <h4 style="border-bottom: 1px solid #dce7f4; padding-bottom: 10px">
                最热评论<span style="float: right; background: #b2dba1">×</span></h4>
                <div class='comment-content-div'></div>
                <div class="input-group"  style="margin-top: 5px">
                    <input type="text" class="form-control" placeholder="输入评论">
                    <span class="input-group-btn">
                        <button class="btn btn-default"
                        onclick="sendComment(${i},${currentPage})" id="comment-btn-${i}">评论</button>
                    </span>
                </div>
            </div>  
        </div>    
        <div class="media-right">
            <a href="#"><img src="${totalData[i]['img']}"></a>
        </div>     
    </div>`)
    }
    showPageNum(currentPage);
}


//更新数据
function updateData(index, currentPage, field, value=0){
    let totalData = getPageData(currentPage, 0);
    index += (currentPage-1)*pageSize ;  // 在总数据里的索引
    let rawData = totalData.splice(index,1)[0];  //取出要修改的数据
    console.log(rawData, "updateData");
    if (field === 'zanNum' || field === 'discussNum'){
        rawData[field] += 1;  //更新
    }
    //追加评论
    if(field === 'comment'){
        rawData[field].push(value)
    }
    totalData.splice(index,0,rawData);  // 重新插入原来位置
    localStorage.setItem('content',JSON.stringify(totalData)); // 写入本地
    load(currentPage);  // 重新加载
}

// 展示评论面板
function showComment(index, currentPage) {
    event.stopPropagation();

    $('#content-'+index+' .comment-content-div').empty();
    //加载评论数据
    let commentData = getComment(index, currentPage);
    for(let i = 0; i < commentData.length; i++){
        $(`<p><span style="color: red">路人甲乙丙丁:&nbsp;</span> ${commentData[i]}</p>`)
            .appendTo($('#content-'+index+' .comment-content-div'));
    }
    // 展示评论面板
    $('#content-'+index).css('display','block');

    // 收起评论面板
    $('#content-'+index+' h4 span').click(function () {
       hideComment(index);
    });

};

//收起评论面板
function hideComment(index) {
    $('#content-'+index).css('display','none');
}
