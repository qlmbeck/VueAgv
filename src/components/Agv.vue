<template>
<div>
	<div class="navbar navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<button class="navbar-toggle collapsed" data-toggle="collapsed" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
				</button>
				<a href="#" class="navbar-brand">agv小车调度系统</a>
			</div>
			<div class="navbar-collapse collapse">
				<div class="navbar-user navbar-right">
					<ul class="nav navbar-nav">
						<li class="active"><a href="#" class="dropdown-toggle" data-toggle="dropdown"> <span class="glyphicon glyphicon-user"></span> 管理员<span
								class="caret"></span>
						</a>
							<ul class="dropdown-menu">
								<li>修改密码</li>
								<li class="divider"></li>
								<li>退出</li>
							</ul></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="nav-crumb">
		<ol class="breadcrumb">
			<li>主页</li>
			<li class="active">初始化地图</li>
		</ol>
	</div>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-2">
				<div  style="position: relative; top: 10px; left: 20px">
					<div  style="height: 10px;"></div>
					<p>初始化网格：</p>
					<table class="table table-striped"  style="white-space: nowrap;">
						<tr>
							<td><p>WIDTH:</p></td>
							<td><input id="mapwidth" v-model="mapwidth" type="text" style="width: 135px;" placeholder="地图实际长度"></td>
							<td><p>m</p></td>
						</tr>
						<tr>
							<td><p>HIGHT:</p></td>
							<td><input id="maphight" v-model="maphight" type="text" style="width: 135px;" placeholder="地图实际宽度"></td>
							<td><p>m</p></td>
						</tr>
						<tr>
							<td><p>精度:</p></td>
							<td><input id="minlength" v-model="minlength" type="text" style="width: 135px;" placeholder="路径最大公约数"></td>
							<td><p>m</p></td>
						</tr>
						<tr>
							<td><p>速度:</p></td>
							<td><input id="v" v-model="v" type="text" style="width: 135px;" placeholder="AGV实际速度"></td>
							<td><p>m/s</p></td>
						</tr>
					</table>
					<table id="inittable" class="table table-striped"  style="white-space: nowrap;">
					</table>
					<button id="initbtn" class="btn btn-primary" @click="init">生成网格</button>
					<div style="height: 10px;"></div>
					<button id="savebtn2" class="btn" @click="exportmap">导出map文件</button>
					
					<div style="height: 280px;"></div>
					<input type="file" @change="importmap" id ="files"/>
					<div style="height: 20px;"></div>
					<button id="savebtn" class="btn btn-success">保存地图</button>

				</div>
			</div>
			<div class="col-md-10">
				<canvas id="myCanvas" @click="getpos(event)" width="1600px" height="800px"  style="position: absolute; left: 90; top: 0; z-index: 1; border: 2px dashed black;"></canvas>
				<canvas id="myCanvas2" width="1600px" height="800px" style="position: absolute; left: 90; top: 0; z-index: 0; border: 2px dashed black;"></canvas>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import {saveAs}from '../js/FileSaver.js'
export default {
  name: 'Agv',
  data () {
    return {
     mapwidth:null,
	 maphight:null,
	 minlength:null,
	 v:null,
	 allx:[],
	 ally:[],
	 accuracy:null,
	 pxv:null,
	 nodenum:0,
	 x:[],
	 y:[],
	 nodename:[],
	 indexnode:[],
	 pathstart:[],
	 pathend:[],
	 pathdis:[],
	 indexpath:[],
	 tag:0,
	 strimport:null,
	 tagimport:0
    }
  },
  methods: {
	init(){//地图初始化
			var division1 = 0;
			var division2 = 0;
			var ratio = 0;
			var ttttt = 0;
			var canvas2 = document.getElementById("myCanvas2");
			var ctx2 = canvas2.getContext("2d");
			division1 = parseInt(this.mapwidth / this.minlength);
			division2 = parseInt(this.maphight / this.minlength);
			if ((division1 * 100 <= 1400) && (division2 * 100 <= 600)) {
				this.accuracy = 100;
				ratio = parseInt(this.accuracy / this.minlength);
			} else {
				if ((division1 * 80 <= 1440) && (division2 * 80 <= 640)) {
					this.accuracy = 80;
					ratio = parseInt(this.accuracy / this.minlength);
				} else {
					if ((division1 * 50 <= 1500) && (division2 * 50 <= 700)) {
						this.accuracy = 50;
						ratio = parseInt(this.accuracy / this.minlength);
					} else {
						if ((division1 * 40 <= 1520) && (division2 * 40 <= 720)) {
							this.accuracy = 40;
							ratio = parseInt(this.accuracy / this.minlength);
						} else {
							alert("您输入的长度、宽度过大或者精度过小，请重新考量！");
							ttttt = 1;
						}
					}
				}
			}

			this.pxv = ratio * v.value;

			if (ttttt == 0) {
				var tabhtml = "<tr><td>每格代表长度为 " + minlength.value
						+ " m</td></tr><tr><td>每格像素长度为 " + this.accuracy
						+ " px</td></tr>";
				$('#inittable').append(tabhtml);
			}

			//设置直线参数
			ctx2.globalAlpha = 0.3;
			ctx2.lineWidth = 3;
			ctx2.lineCap = "round"; //设置端点样式:butt(默认),round,square
			ctx2.lineJoin = "miter"; //设置连接样式:miter(默认),bevel,round
			//开始绘制直线
			for (var i = 0; i < 800 / this.accuracy; i++) {
				ctx2.beginPath();
				ctx2.moveTo(20, this.accuracy * (i + 1));
				ctx2.lineTo(1580, this.accuracy * (i + 1));
				ctx2.stroke();
				ctx2.closePath();
				this.ally[i] = this.accuracy * (i + 1);
			}
			for (var j = 0; j < 1600 / this.accuracy; j++) {
				ctx2.beginPath();
				ctx2.moveTo(this.accuracy * (j + 1), 20);
				ctx2.lineTo(this.accuracy * (j + 1), 780);
				ctx2.stroke();
				ctx2.closePath();
				this.allx[j] = this.accuracy * (j + 1);
			}
			//console.dir(allx);
			//.dir(ally);
			//设置文字参数
			ctx2.globalAlpha = 1;
			ctx2.font = "bold 20px";
			ctx2.fillStyle = "#FF0000";
			//开始绘制文字
			for (i = 0; i < 800 / this.accuracy - 1; i++) {
				ctx2.fillText(i + 1, 10, this.accuracy * (i + 1));
			}
			for (j = 0; j < 1600 / this.accuracy - 1; j++) {
				ctx2.fillText(j + 1, this.accuracy * (j + 1), 10);
			}	
	
	},
	getpos(e){
			e = e || event;
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			var factx = e.clientX - canvas.getBoundingClientRect().left;
			var facty = e.clientY - canvas.getBoundingClientRect().top;

			//var aaa = e.offsetX; //相对坐标
			//var bbb = e.offsetY;
			//alert(aaa+" "+bbb);

			var xtag = 0;
			var ytag = 0;
			for (var i = 0; i < this.allx.length; i++) {
				if (factx >= this.allx[i] - 5 && factx <= this.allx[i] + 5) {
					xtag = 1;
				}
			}
			for (var i = 0; i < this.ally.length; i++) {
				if (facty >= this.ally[i] - 5 && facty <= this.ally[i] + 5) {
					ytag = 1;
				}
			}
			if (xtag == 1 && ytag == 1) {
				var px = parseInt((factx + 6) / this.accuracy) * this.accuracy;
				var py = parseInt((facty + 6) / this.accuracy) * this.accuracy;
				//alert("横坐标为：" + px + " " + "纵坐标为：" + py + " " + xtag + " " + ytag);
				var numxx = px;
				var numyy = py;
				var thisnodename;
				var thisi;

				var tag5 = 0;
				for (var i = 0; i < this.nodename.length; i++) {
					if (numxx == this.x[i] && numyy == this.y[i] && this.indexnode[i] == 1) {
						tag5 = 1;
						thisi = i;
						thisnodename = this.nodename[i];
					} else {
					}
				}

				if (tag5 == 1) { //删除节点
					var tt1 = 0, tt2 = 0;
					for (var i = 0; i < this.pathstart.length; i++) {
						if (thisnodename == this.pathstart[i] && this.indexpath[i] == 1) {
							tt1 = 1;
						}
					}
					for (var i = 0; i < this.pathend.length; i++) {
						if (thisnodename == this.pathend[i] && this.indexpath[i] == 1) {
							tt2 = 1;
						}
					}
					if (tt1 == 1 || tt2 == 1) {
						alert("该点为起点或终点，无法删除！");
					} else {
						numxx = numxx - 5;
						numyy = numyy - 5;
						ctx.clearRect(numxx, numyy, 10, 10);
						numxx = numxx - 15;
						numyy = numyy - 15;
						ctx.clearRect(numxx, numyy, 20, 20);
						this.indexnode[thisi] = 0;
					}
				} else { //绘制节点
					ctx.beginPath();
					ctx.arc(numxx, numyy, 5, 0, Math.PI * 2, true);
					ctx.fillStyle = "#6495ED";
					ctx.fill();
					//设置文字参数
					ctx.font = "bold 20px";
					var numxxx = numxx - 20;
					var numyyy = numyy - 10;
					ctx.fillText(this.nodenum + 1, numxxx, numyyy);
					this.x[this.nodenum] = numxx;
					this.y[this.nodenum] = numyy;
					this.nodename[this.nodenum] = this.nodenum + 1;
					this.indexnode[this.nodenum] = 1;
					this.nodenum = this.nodenum + 1;console.log(this.nodenum);
				}
			} else if (xtag == 1 && ytag != 1) {
				var tag1 = 0;
				var tag2 = 0;
				var startx, starty = 1, endx, endy = 1;
				var factytemp1;
				var factytemp2;
				var startname1;
				var endname1;
				var disdel1;
				factytemp1 = facty;
				factytemp2 = facty;
				startx = parseInt((factx + 6) / this.accuracy) * this.accuracy;
				endx = parseInt((factx + 6) / this.accuracy) * this.accuracy;
				while (starty > 0) {
					starty = parseInt(factytemp1 / this.accuracy) *this.accuracy;
					factytemp1 = factytemp1 - this.accuracy;
					//alert(starty);
					for (var i = 0; i < this.y.length; i++) {
						if (starty == this.y[i] && startx == this.x[i]
								&& this.indexnode[i] == 1) {
							startname1 = this.nodename[i];
							tag1 = 1;
							break;
						}
					}
					if (tag1 == 1) {
						break;
					}
				}
				while (endy < 800) {
					factytemp2 = factytemp2 + parseInt(this.accuracy);
					endy = parseInt(factytemp2 / this.accuracy) * this.accuracy;
					//alert(endy);
					for (var i = 0; i < this.y.length; i++) {
						if (endy == this.y[i] && endx == this.x[i] && this.indexnode[i] == 1) {
							endname1 = this.nodename[i];
							tag2 = 1;
							break;
						}
					}
					if (tag2 == 1) {
						break;
					}
				}
				//alert(startx+" "+starty+" "+endx+" "+endy+" "+tag1+" "+tag2);
				if (tag1 == 1 && tag2 == 1) {
					var tag12 = 0;
					for (var i = 0; i < this.indexpath.length; i++) {
						if (startname1 == this.pathstart[i]
								&& endname1 == this.pathend[i] && this.indexpath[i] == 1) {
							this.indexpath[i] = 0;
							disdel1 = this.pathdis[i] - 10;
							tag12 = 1;
						}
					}
					if (tag12 == 1) {
						ctx.clearRect(startx - 2, starty + 5, 4, disdel1);
					} else {
						//设置直线参数
						ctx.lineWidth = 4;
						ctx.lineCap = "round"; //设置端点样式:butt(默认),round,square
						ctx.lineJoin = "miter"; //设置连接样式:miter(默认),bevel,round
						ctx.strokeStyle = '#FA8072'; // 设置线的颜色

						ctx.beginPath();
						ctx.moveTo(startx, starty + 6);
						ctx.lineTo(endx, endy - 6);
						ctx.stroke();
						ctx.closePath();

						this.pathstart[this.tag] = startname1;
						this.pathend[this.tag] = endname1;
						this.pathdis[this.tag] = endy - starty;
						this.indexpath[this.tag] = 1;
						this.tag++;
					}
				} else {console.log(tag1+" "+tag2);
					alert("请勿点击无效区域！");
				}
			} else if (xtag != 1 && ytag == 1) {
				var tag3 = 0;
				var tag4 = 0;
				var startx = 1, starty, endx = 1, endy;
				var factxtemp1;
				var factxtemp2;
				var startname2;
				var endname2;
				var disdel2;
				factxtemp1 = factx;
				factxtemp2 = factx;
				starty = parseInt((facty + 6) / this.accuracy) * this.accuracy;
				endy = parseInt((facty + 6) / this.accuracy) * this.accuracy;
				while (startx > 0) {
					startx = parseInt(factxtemp1 / this.accuracy) * this.accuracy;
					factxtemp1 = factxtemp1 - this.accuracy;
					//alert(startx);
					for (var i = 0; i < this.y.length; i++) {
						if (startx == this.x[i] && starty == this.y[i]
								&& this.indexnode[i] == 1) {
							startname2 = this.nodename[i];
							tag3 = 1;
							break;
						}
					}
					if (tag3 == 1) {
						break;
					}
				}
				while (endx < 1500) {
					factxtemp2 = factxtemp2 + parseInt(this.accuracy);
					endx = parseInt(factxtemp2 / this.accuracy) * this.accuracy;
					//alert(endx);
					for (var i = 0; i < this.y.length; i++) {
						if (endx == this.x[i] && endy == this.y[i] && this.indexnode[i] == 1) {
							endname2 = this.nodename[i];
							tag4 = 1;
							break;
						}
					}
					if (tag4 == 1) {
						break;
					}
				}
				//alert(startx+" "+starty+" "+endx+" "+endy+" "+tag3+" "+tag4);
				if (tag3 == 1 && tag4 == 1) {
					var tag34 = 0;
					for (var i = 0; i < this.indexpath.length; i++) {
						if (startname2 == this.pathstart[i]
								&& endname2 == this.pathend[i] && this.indexpath[i] == 1) {
							this.indexpath[i] = 0;
							disdel2 = this.pathdis[i] - 10;
							tag34 = 1;
						}
					}
					if (tag34 == 1) {
						ctx.clearRect(startx + 5, starty - 2, disdel2, 4);
					} else {
						//设置直线参数
						ctx.lineWidth = 4;
						ctx.lineCap = "round"; //设置端点样式:butt(默认),round,square
						ctx.lineJoin = "miter"; //设置连接样式:miter(默认),bevel,round
						ctx.strokeStyle = '#FA8072'; // 设置线的颜色

						ctx.beginPath();
						ctx.moveTo(startx + 6, starty);
						ctx.lineTo(endx - 6, endy);
						ctx.stroke();
						ctx.closePath();

						this.pathstart[this.tag] = startname2;
						this.pathend[this.tag] = endname2;
						this.pathdis[this.tag] = endx - startx;
						this.indexpath[this.tag] = 1;
						this.tag++;
					}
				} else {
					alert("请勿点击无效区域！");
				}

			} else {
				alert("请勿点击空白区域！");
			}
	
	
	},
	exportmap(){//导出map文件
			var arrpathstart = [];
			for (var i = 0; i < this.pathstart.length; i++) {
				var jsonobj1 = {};
				jsonobj1["this.pathstart"] = this.pathstart[i];
				arrpathstart[i] = jsonobj1;
			}

			var arrpathend = [];
			for (var i = 0; i < this.pathend.length; i++) {
				var jsonobj2 = {};
				jsonobj2["this.pathend"] = this.pathend[i];
				arrpathend[i] = jsonobj2;
			}

			var arrpathdis = [];
			for (var i = 0; i < this.pathdis.length; i++) {
				var jsonobj3 = {};
				jsonobj3["distance"] = this.pathdis[i];
				arrpathdis[i] = jsonobj3;
			}

			var arrindexpath = [];
			for (var i = 0; i < this.indexpath.length; i++) {
				var jsonobj7 = {};
				jsonobj7["this.indexpath"] = this.indexpath[i];
				arrindexpath[i] = jsonobj7;
			}

			var arrnodename = [];
			for (var i = 0; i < this.nodename.length; i++) {
				var jsonobj4 = {};
				jsonobj4["this.nodename"] = this.nodename[i];
				arrnodename[i] = jsonobj4;
			}

			var arrx = [];
			for (var i = 0; i < this.x.length; i++) {
				var jsonobj5 = {};
				jsonobj5["this.x"] = this.x[i];
				arrx[i] = jsonobj5;
			}

			var arry = [];
			for (var i = 0; i < this.y.length; i++) {
				var jsonobj6 = {};
				jsonobj6["this.y"] = this.y[i];
				arry[i] = jsonobj6;
			}

			var arrindexnode = [];
			for (var i = 0; i < this.indexnode.length; i++) {
				var jsonobj8 = {};
				jsonobj8["this.indexnode"] = this.indexnode[i];
				arrindexnode[i] = jsonobj8;
			}

			//console.dir(arrpathstart);
			//console.dir(arrpathend);
			//console.dir(arrpathdis);
			//alert(arr1);
			var arrxx = {
				"stratset" : arrpathstart,
				"endset" : arrpathend,
				"disset" : arrpathdis,
				"indexpathset" : arrindexpath,
				"nodeset" : arrnodename,
				"xset" : arrx,
				"yset" : arry,
				"indexnodeset" : arrindexnode

			};
			
			var arr = JSON.stringify(arrxx);
			
			var file = new File([arr], "FileName.txt", {type: "text/plain;charset=utf-8"});
			saveAs(file);
	},
	importmap(){//读取地图文件
			var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
		    var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
		    reader.readAsText(selectedFile);//读取文件的内容
		    reader.onload = function(f){
		        //console.log(this.result);
		        this.strimport = this.result;
		        this.tagimport = 1;
		        alert("读取完毕，保存地图即可！");
		    };
	
	
	}
  
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
