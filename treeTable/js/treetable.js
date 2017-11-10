
function treetableTabel(data){
   var elem = $(data.elem);
   var cols = data.cols; //json
   var res = data.data

   // header 区域模板
   var tpl_header= function(options){
    options = options || {};
    return [
    		'	<ul>',
	    		function(){
	    			th ='';
	    			$.each(cols,function(i,item){
	    				th += ['<li class="node-treetable-label" data-field="'+(item.field ? item.field : i)+'">',
	    					   '<div class="tree-table-cell" style="width:'+(item.width || '')+'px" align="'+(item.align || '')+'">'+(item.title || '')+'</div>',
			    			   '</li>'].join("");
	    			})
	    			return th
	    		}(),
    		'	</ul>', ].join("");
   }

   // boady 区域模板\
   var li='';
   var level =1;
   var tbody = $('<div class="tree-table-tbody"></div>')
   function tpl_body(ele,res,cols,data,level){  
        $.each(res,function(i,item){
        	var hasChild = item.children && item.children.length > 0;
          var ul = $(['<ul class="treetable-node-chilrden '+(item.spread ? "tree-table-show":"")+'"></ul>'].join(""));
        	var li = $(['<li class="treetable-node"><div class="treetable-node-content" data="'+JSON.stringify(item).replace(/\"/g,"'")+'">',
  	    		function(){
  	    			th ='';
  	    			$.each(cols,function(i2,item2){
  	    				th += ['<div class="node-treetable-label" data-field="'+(item2.field || i2)+'">',
  	    					   '<div class="tree-table-cell '+(i2==0 ? 'title' : '')+'" align="'+(item2.align || '')+'" style="width:'+(item2.width || '')+'px;">',  
                     (i2 ==0 && data.check ? '<div class="treetableTableCheck"><input type="'+data.check+'" /><i></i></div>' :''),               
  	    					   (i2 ==0 ? '<i class="'+(item.spread ? 'active':'')+' tree-table-spread iconfont '+(i2==0 && hasChild ? 'icon-arrow-right' :'')+'"></i>':''),
  	    					   function(){
                      if(item2.templet){
                        var html = $(item2.templet).html()
                        return template(html, item);
                      }else{
                        return '<span title="'+item[item2.field]+'">'+(item[item2.field] || '')+'</span>'
                      }
                     }(),
                     '</div>',
  			    			   '</div>'].join("");
  	    			})
  	    			return th
  	    		}(),
      		'	</div></li>'].join(""));
      		if(hasChild){
      			li.append(ul)
            tpl_body(ul,item.children,cols,data,level)
      		}
         ele.append(li) 
         typeof data.click === 'function' && that.click(li, item); 
        })  
	}
  tpl_body(tbody,res,cols,data,level)

   //主模板
  TPL_MAIN = ['<div class="tree-table-content"  style="width:'+(data.width || '')+'px;height:'+(data.height || '')+'px">'
    ,'<div class="tree-table-header">'
    ,tpl_header()
    ,'</div>'
    ,(tbody.prop("outerHTML"))
    ,'</div>'].join("")
   elem.append(TPL_MAIN)
}

var item = function(that){
  var json= JSON.parse(that.parents('.treetable-node-content').attr('data').replace(/'/g, '"')); 
  return json
}


$(document).on('click','.tree-table-spread',function(item){
  $(this).toggleClass('active');
  var conObj = $(this).parent().parent().parent('.treetable-node-content')
  conObj.next('.treetable-node-chilrden').toggleClass('tree-table-show')
  var jsonObj = conObj.attr('data').replace(/'/g, '"');  
})

$(document).on('click','.treetableTableCheck input',function(){
  var conObj = $(this).parent().parent().parent().parent('.treetable-node-content')
  if($(this).prop('checked') == true){
    conObj.next('.treetable-node-chilrden').find('input').prop('checked',true)
  }else{
    conObj.next('.treetable-node-chilrden').find('input').prop('checked',false)
  }
  
})